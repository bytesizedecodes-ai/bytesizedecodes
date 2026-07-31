"use client";

/**
 * Lazy Pyodide runner in a Web Worker. First Run downloads the WASM runtime;
 * later runs stay off the main thread with a hard timeout.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "loading" | "ready" | "running" | "error";

interface RunResult {
  ok: boolean;
  stdout: string;
  message: string;
}

const RUN_TIMEOUT_MS = 12_000;

export function CodeCell({
  starterCode,
  testCode,
  title,
  onCodeChange,
  onTestResult,
}: {
  starterCode: string;
  testCode?: string;
  title?: string;
  onCodeChange?: (code: string) => void;
  onTestResult?: (ok: boolean) => void;
}) {
  const [code, setCode] = useState(starterCode);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RunResult | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    setCode(starterCode);
  }, [starterCode]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const updateCode = (next: string) => {
    setCode(next);
    onCodeChange?.(next);
  };

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker("/pyodide-worker.js");
    workerRef.current = worker;
    return worker;
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    setStatus("idle");
    setResult(null);
  }, []);

  const run = useCallback(async () => {
    const id = ++requestId.current;
    setStatus("loading");
    setResult(null);
    const worker = ensureWorker();

    await new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => {
        if (requestId.current !== id) return;
        worker.terminate();
        workerRef.current = null;
        setResult({
          ok: false,
          stdout: "",
          message: `Timed out after ${RUN_TIMEOUT_MS / 1000}s. Reset and try a smaller program.`,
        });
        setStatus("error");
        onTestResult?.(false);
        resolve();
      }, RUN_TIMEOUT_MS);

      const onMessage = (event: MessageEvent<RunResult & { id: number }>) => {
        if (event.data.id !== id) return;
        window.clearTimeout(timer);
        worker.removeEventListener("message", onMessage);
        setResult({
          ok: event.data.ok,
          stdout: event.data.stdout,
          message: event.data.message,
        });
        setStatus(event.data.ok ? "ready" : "error");
        onTestResult?.(event.data.ok);
        resolve();
      };

      worker.addEventListener("message", onMessage);
      setStatus("running");
      worker.postMessage({ id, code, testCode });
    });
  }, [code, ensureWorker, onTestResult, testCode]);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-ash px-4 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
          {title ?? "Try it"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-ash/70"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => void run()}
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
      </div>
      <textarea
        value={code}
        onChange={(e) => updateCode(e.target.value)}
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
          Python runs in a Web Worker via Pyodide — first run downloads ~10 MB, with a
          12s timeout.
        </p>
      )}
    </div>
  );
}
