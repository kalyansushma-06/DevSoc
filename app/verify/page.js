// app/verify/page.js
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CertificateCanvas from "@/components/CertificateCanvas";
import { CheckCircle2, XCircle, Search, ShieldCheck, Printer, RefreshCw } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const certIdQuery = searchParams.get("id") || searchParams.get("code");

  const [inputCertId, setInputCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState(null);
  const certPrintRef = useRef(null);

  useEffect(() => {
    if (certIdQuery) {
      setInputCertId(certIdQuery);
      fetchCertificate(certIdQuery);
    }
  }, [certIdQuery]);

  const fetchCertificate = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/certificates/verify?id=${encodeURIComponent(id)}`);
      const data = await res.json();

      if (res.ok && data?.certificate) {
        setCertData(data.certificate);
      } else {
        setError(data?.message || "Certificate not found or invalid ID.");
        setCertData(null);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while validating the certificate.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (inputCertId.trim()) {
      fetchCertificate(inputCertId.trim());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const recipientName = (certData?.recipientName || certData?.name || "").trim();
  const eventName = (certData?.eventName || certData?.event || "").trim();
  const hasName = recipientName.length > 0;
  const hasEvent = eventName.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4" /> Official DevSoc Credential Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Verify Certificate Authenticity
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Scan the certificate QR code or enter the Certificate ID to view the verified credential.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleManualSearch} className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Enter Certificate ID (e.g. CERT-B1BXRCL)"
            value={inputCertId}
            onChange={(e) => setInputCertId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Verification Status Banner */}
        {certData && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-emerald-300">Authentic Certificate Verified</h3>
                {hasName && hasEvent ? (
                  <p className="text-xs text-emerald-400/80">
                    Issued to <span className="font-semibold text-white">{recipientName}</span> for{" "}
                    <span className="font-semibold text-white">{eventName}</span>
                  </p>
                ) : hasName ? (
                  <p className="text-xs text-emerald-400/80">
                    Issued to <span className="font-semibold text-white">{recipientName}</span>
                  </p>
                ) : hasEvent ? (
                  <p className="text-xs text-emerald-400/80">
                    Issued for <span className="font-semibold text-white">{eventName}</span>
                  </p>
                ) : (
                  <p className="text-xs text-emerald-400/80">
                    Certificate ID <span className="font-mono font-semibold text-white">{certData.certificateId || certData.id}</span> is authenticated and registered with DevSoc.
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>
        )}

        {error && (
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-rose-300 text-sm">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            {error}
          </div>
        )}

        {/* Visual Certificate Display */}
        {certData && (
          <div ref={certPrintRef} className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-2 sm:p-4 rounded-2xl shadow-2xl">
              <CertificateCanvas
                templateUrl={certData.templateUrl}
                data={certData}
                layout={certData.layout}
                isEditable={false}
                qrUrl={
                  certData.qrUrl ||
                  `${typeof window !== "undefined" ? window.location.origin : "https://devsoc-three.vercel.app"}/verify?id=${certData.certificateId || certData.id}`
                }
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Default export wrapped in Suspense (Required for Next.js build)
export default function VerifyCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
          <RefreshCw className="w-5 h-5 animate-spin mr-2 text-indigo-500" />
          Loading verification portal...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}