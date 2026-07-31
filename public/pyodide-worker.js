/* global loadPyodide */
/* eslint-disable no-undef */

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";

let ready = null;

async function getPyodide() {
  if (!ready) {
    importScripts(`${PYODIDE_URL}pyodide.js`);
    ready = loadPyodide({ indexURL: PYODIDE_URL });
  }
  return ready;
}

self.onmessage = async (event) => {
  const { id, code, testCode } = event.data;
  try {
    const pyodide = await getPyodide();
    let stdout = "";
    pyodide.setStdout({ batched: (s) => { stdout += `${s}\n`; } });
    pyodide.setStderr({ batched: (s) => { stdout += `${s}\n`; } });

    const wrapped = testCode
      ? `${code}\n\nok = False\nmessage = "tests did not run"\n${testCode}\n`
      : `${code}\n\nok = True\nmessage = "ran"\n`;

    await pyodide.runPythonAsync(wrapped);
    const ok = Boolean(await pyodide.runPythonAsync("ok"));
    const message = String(await pyodide.runPythonAsync("message"));
    self.postMessage({ id, ok, stdout: stdout.trim(), message });
  } catch (error) {
    self.postMessage({
      id,
      ok: false,
      stdout: "",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
