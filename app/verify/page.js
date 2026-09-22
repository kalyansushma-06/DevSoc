"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null); // null | { found, certificate? }
  const [state, setState] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    setResult(null);
    try {
      const res = await fetch(`/api/certificates/verify?certId=${encodeURIComponent(certId)}`);
      const data = await res.json();
      setResult(data);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="section max-w-3xl">
      <span className="eyebrow">Public registry</span>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Certificate Verification</h1>
      <p className="mt-6 text-white/60">
        Anyone — a recruiter, a professor, you — can look up a DevSoc certificate ID here to
        confirm it's genuine, who issued it, and what it was issued for.
      </p>

      <form onSubmit={handleSubmit} className="glass-panel mt-10 flex flex-col gap-3 p-6 sm:flex-row">
        <input
          required
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          placeholder="Enter certificate ID, e.g. DEVSOC-2026-0001"
          className="nova-input font-mono"
        />
        <button type="submit" disabled={state === "loading"} className="nova-btn-primary whitespace-nowrap">
          {state === "loading" ? "Checking..." : "Verify"}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          {result.found ? (
            <div className="glass-panel overflow-hidden border-nova-cyan/40 p-8">
              <div className="flex items-center justify-between">
                <span className="nova-tag !border-nova-cyan/50 !text-nova-cyan">
                  ✓ {result.certificate.status === "valid" ? "Genuine Certificate" : `Status: ${result.certificate.status}`}
                </span>
                <span className="font-mono text-xs text-white/40">{result.certificate.certId}</span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold">{result.certificate.name}</h2>
              <p className="mt-1 text-white/60">{result.certificate.issuedFor}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm">
                <div>
                  <p className="text-white/40">Issued by</p>
                  <p className="mt-1 font-medium">{result.certificate.issuedBy}</p>
                </div>
                <div>
                  <p className="text-white/40">Date issued</p>
                  <p className="mt-1 font-medium">{result.certificate.dateIssued}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel border-red-500/30 p-8 text-center">
              <p className="font-display text-lg font-semibold text-red-300">No matching certificate found</p>
              <p className="mt-2 text-sm text-white/50">
                Double check the ID for typos. If you believe this is an error, contact us.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
