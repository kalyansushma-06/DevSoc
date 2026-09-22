"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { pdf } from "@react-pdf/renderer";
import CertificatePDF from "@/components/CertificatePDF";
import { adminFetch } from "@/lib/adminFetch";

const EMPTY = {
  certId: "",
  name: "",
  issuedFor: "",
  issuedBy: "",
  dateIssued: "",
  status: "valid",
};

export default function AdminCertificatesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  async function load() {
    try {
      const data = await adminFetch("/api/certificates");

      const certificates = Array.isArray(data.items)
        ? data.items
        : [];

      setItems(
        certificates.sort((a, b) =>
          (b.dateIssued || "").localeCompare(a.dateIssued || "")
        )
      );
    } catch (err) {
      setError(err.message || "Unable to load certificates.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function generateQR(certificate) {
    const verifyUrl =
      `${window.location.origin}/verify?certId=` +
      encodeURIComponent(certificate.certId);

    const qr = await QRCode.toDataURL(verifyUrl, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: "H",
    });

    return qr;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await adminFetch("/api/certificates", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const certificate = data.item;

      setForm(EMPTY);

      const qr = await generateQR(certificate);

      setSelectedCertificate(certificate);
      setQrDataUrl(qr);

      await load();
    } catch (err) {
      setError(err.message || "Unable to issue certificate.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(cert) {
    try {
      setError("");

      const next =
        cert.status === "valid"
          ? "revoked"
          : "valid";

      await adminFetch(`/api/certificates/${cert.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: next,
        }),
      });

      await load();

      if (
        selectedCertificate &&
        selectedCertificate.id === cert.id
      ) {
        setSelectedCertificate({
          ...cert,
          status: next,
        });
      }
    } catch (err) {
      setError(err.message || "Unable to update certificate status.");
    }
  }

  async function handleDelete(id) {
    if (
      !confirm(
        "Permanently delete this certificate record?"
      )
    ) {
      return;
    }

    try {
      setError("");

      await adminFetch(`/api/certificates/${id}`, {
        method: "DELETE",
      });

      if (
        selectedCertificate &&
        selectedCertificate.id === id
      ) {
        setSelectedCertificate(null);
        setQrDataUrl("");
      }

      await load();
    } catch (err) {
      setError(err.message || "Unable to delete certificate.");
    }
  }

  async function openPreview(certificate) {
    try {
      setError("");

      const qr = await generateQR(certificate);

      setSelectedCertificate(certificate);
      setQrDataUrl(qr);
    } catch (err) {
      setError(err.message || "Unable to generate QR code.");
    }
  }

  function closePreview() {
    setSelectedCertificate(null);
    setQrDataUrl("");
  }

  async function downloadCertificate(certificate, qr) {
    try {
      setPdfLoading(true);
      setError("");

      const blob = await pdf(
        <CertificatePDF
          certificate={certificate}
          qrDataUrl={qr}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${certificate.certId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.message || "Unable to generate PDF."
      );
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleDownload(certificate) {
    try {
      const qr = await generateQR(certificate);

      await downloadCertificate(
        certificate,
        qr
      );
    } catch (err) {
      setError(
        err.message || "Unable to generate certificate."
      );
    }
  }

  return (
    <div className="relative">
      {/* PAGE HEADER */}

      <div>
        <h1 className="font-display text-2xl font-bold">
          Certificates
        </h1>

        <p className="mt-1 text-sm text-white/50">
          Every certificate issued here becomes instantly
          checkable on the public Verify page.
        </p>
      </div>

      {/* CREATE CERTIFICATE */}

      <form
        onSubmit={handleSubmit}
        className="glass-panel mt-6 grid gap-3 p-6 sm:grid-cols-2"
      >
        

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Recipient Name
          </label>

          <input
            required
            placeholder="Recipient name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="nova-input w-full"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Date Issued
          </label>

          <input
            required
            type="date"
            value={form.dateIssued}
            onChange={(e) =>
              setForm({
                ...form,
                dateIssued: e.target.value,
              })
            }
            className="nova-input w-full"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Issued For
          </label>

          <input
            required
            placeholder="Orbit Hackathon - Winner"
            value={form.issuedFor}
            onChange={(e) =>
              setForm({
                ...form,
                issuedFor: e.target.value,
              })
            }
            className="nova-input w-full"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Issued By
          </label>

          <input
            required
            placeholder="Your name, role"
            value={form.issuedBy}
            onChange={(e) =>
              setForm({
                ...form,
                issuedBy: e.target.value,
              })
            }
            className="nova-input w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="nova-btn-primary sm:col-span-2"
        >
          {loading
            ? "Issuing..."
            : "Issue certificate"}
        </button>

        {error && (
          <p className="text-xs text-red-400 sm:col-span-2">
            {error}
          </p>
        )}
      </form>

      {/* CERTIFICATE LIST */}

      <div className="mt-8 space-y-3">
        {items.map((c) => (
          <div
            key={c.id}
            className="glass-panel flex flex-wrap items-center justify-between gap-4 p-4"
          >
            {/* Certificate information */}

            <div className="min-w-0">
              <p className="font-mono text-xs text-nova-cyan">
                {c.certId}
              </p>

              <p className="mt-1 font-display text-sm font-semibold">
                {c.name}
              </p>

              <p className="text-xs text-white/40">
                {c.issuedFor} · issued{" "}
                {c.dateIssued} by {c.issuedBy}
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap items-center gap-2">

              {/* Status */}

              <span
                className={`nova-tag ${
                  c.status === "valid"
                    ? "!border-nova-cyan/40 !text-nova-cyan"
                    : "!border-red-400/40 !text-red-300"
                }`}
              >
                {c.status}
              </span>

              {/* QR / Preview */}

              <button
                type="button"
                onClick={() => openPreview(c)}
                className="nova-btn-secondary !px-4 !py-1.5 text-xs"
              >
                QR / Preview
              </button>

              {/* Download PDF */}

              <button
                type="button"
                onClick={() =>
                  handleDownload(c)
                }
                disabled={pdfLoading}
                className="nova-btn-primary !px-4 !py-1.5 text-xs"
              >
                {pdfLoading
                  ? "Generating..."
                  : "Download PDF"}
              </button>

              {/* Revoke / Reinstate */}

              <button
                type="button"
                onClick={() =>
                  toggleStatus(c)
                }
                className="nova-btn-secondary !px-4 !py-1.5 text-xs"
              >
                {c.status === "valid"
                  ? "Revoke"
                  : "Reinstate"}
              </button>

              {/* Delete */}

              <button
                type="button"
                onClick={() =>
                  handleDelete(c.id)
                }
                className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-white/50">
            No certificates issued yet.
          </p>
        )}
      </div>

      {/* PREVIEW MODAL */}

      {selectedCertificate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

          <div className="glass-panel relative w-full max-w-lg rounded-2xl p-6 shadow-2xl">

            {/* Close */}

            <button
              type="button"
              onClick={closePreview}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>

            {/* Header */}

            <div className="pr-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nova-cyan">
                Certificate Preview
              </p>

              <h2 className="mt-2 font-display text-xl font-bold">
                {selectedCertificate.name}
              </h2>

              <p className="mt-1 font-mono text-xs text-white/40">
                {selectedCertificate.certId}
              </p>
            </div>

            {/* QR */}

            <div className="mt-6 flex justify-center">
              {qrDataUrl && (
                <div className="rounded-2xl bg-white p-4">
                  <img
                    src={qrDataUrl}
                    alt="Certificate verification QR code"
                    className="h-52 w-52"
                  />
                </div>
              )}
            </div>

            {/* Certificate details */}

            <div className="mt-6 grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">

              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">
                  Recipient
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {selectedCertificate.name}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">
                  Achievement
                </p>

                <p className="mt-1 text-sm">
                  {selectedCertificate.issuedFor}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    Date Issued
                  </p>

                  <p className="mt-1 text-sm">
                    {selectedCertificate.dateIssued}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    Status
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      selectedCertificate.status ===
                      "valid"
                        ? "text-nova-cyan"
                        : "text-red-300"
                    }`}
                  >
                    {selectedCertificate.status}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40">
                  Issued By
                </p>

                <p className="mt-1 text-sm">
                  {selectedCertificate.issuedBy}
                </p>
              </div>
            </div>

            {/* Verification URL */}

            <p className="mt-4 text-center text-xs text-white/40">
              Scan the QR code to verify this certificate
              publicly.
            </p>

            {/* Modal actions */}

            <div className="mt-5 flex flex-wrap justify-end gap-2">

              <button
                type="button"
                onClick={() =>
                  handleDownload(
                    selectedCertificate
                  )
                }
                disabled={pdfLoading}
                className="nova-btn-primary"
              >
                {pdfLoading
                  ? "Generating PDF..."
                  : "Download PDF"}
              </button>

              <button
                type="button"
                onClick={closePreview}
                className="nova-btn-secondary"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}