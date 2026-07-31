"use client";

/**
 * Lazy Pyodide runner. The runtime is loaded on first "Run" click — never on page load —
 * because the WASM bundle is multi-megabyte.
 */

import { useCallback, useRef, useState } from "react";

type Status = "idle" | "loading" | "ready" | "running" | "error";

interface RunResult {
  ok: boolean;
  stdout: string;
  message: string;
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
}

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";

let shared: Promise<PyodideInterface> | null = null;

function loadRuntime(): Promise<PyodideInterface> {
  if (shared) return shared;
  shared = (async () => {
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = `${PYODIDE_URL}pyodide.js`;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load Pyodide"));
        document.head.appendChild(s);
      });
    }
    if (!window.loadPyodide) throw new Error("Pyodide global missing");
    return window.loadPyodide({ indexURL: PYODIDE_URL });
  })();
  return shared;
}

export function CodeCell({
  starterCode,
  testCode,
  title,
}: {
  starterCode: string;
  testCode?: string;
  title?: string;
}) {
  const [code, setCode] = useState(starterCode);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RunResult | null>(null);
  const abortRef = useRef(0);

  const run = useCallback(async () => {
    const token = ++abortRef.current;
    setStatus("loading");
    setResult(null);
    try {
      const py = await loadRuntime();
      if (token !== abortRef.current) return;
      setStatus("running");

      let stdout = "";
      py.setStdout({ batched: (s) => { stdout += s + "\n"; } });
      py.setStderr({ batched: (s) => { stdout += s + "\n"; } });

      // Wrap user code + optional tests. Tests set `ok` and optional `message`.
      const wrapped = testCode
        ? `${code}\n\nok = False\nmessage = "tests did not run"\n${testCode}\n`
        : `${code}\n\nok = True\nmessage = "ran"\n`;

      await py.runPythonAsync(wrapped);
      if (token !== abortRef.current) return;

      const ok = Boolean(await py.runPythonAsync("ok"));
      const message = String(await py.runPythonAsync("message"));
      setResult({ ok, stdout: stdout.trim(), message });
      setStatus("ready");
    } catch (e) {
      if (token !== abortRef.current) return;
      setResult({
        ok: false,
        stdout: "",
        message: e instanceof Error ? e.message : String(e),
      });
      setStatus("error");
    }
  }, [code, testCode]);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-ash px-4 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
          {title ?? "Try it"}
        </p>
        <button
          type="button"
          onClick={run}
          disabled={status === "loading" || status === "running"}
          className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
        >
          {status === "loading"
            ? "Loading Python…"
            : status === "running"
              ? "Running…"
              : "Run"}
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="block h-48 w-full resize-y bg-ink px-4 py-3 font-mono text-[13px] leading-relaxed text-canvas outline-none"
      />
      {result && (
        <div
          className={`border-t px-4 py-3 text-sm ${
            result.ok
              ? "border-good/30 bg-good-wash text-ink"
              : "border-bad/30 bg-bad-wash text-ink"
          }`}
        >
          <p className="font-semibold">{result.ok ? "Passed" : "Failed"}</p>
          <p className="mt-1 text-ink-soft">{result.message}</p>
          {result.stdout && (
            <pre className="mt-2 overflow-x-auto font-mono text-[12px] text-ink-soft">
              {result.stdout}
            </pre>
          )}
        </div>
      )}
      {status === "idle" && (
        <p className="border-t border-ash px-4 py-2 text-[11px] text-ink-faint">
          Python runs in your browser via Pyodide — first run downloads ~10 MB.
        </p>
      )}
    </div>
  );
}
