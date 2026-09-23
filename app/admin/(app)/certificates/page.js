// app/admin/(app)/certificates/page.js
"use client";

import { useState, useEffect } from "react";
import CertificateCanvas from "@/components/CertificateCanvas";
import {
  Upload,
  Save,
  CheckCircle,
  RefreshCw,
  Plus,
  RotateCcw,
  Sliders,
  Trash2,
  Search,
  ExternalLink,
  Eye,
  FileDown,
  X,
} from "lucide-react";

export default function AdminCertificatesPage() {
  const [mounted, setMounted] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const [templateUrl, setTemplateUrl] = useState("");

  // Certificates list state
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);

  const [certData, setCertData] = useState({
    recipientName: "",
    recipientEmail: "",
    eventName: "",
    issueDate: "",
    certificateId: "CERT-SAMPLE",
  });

  const [layout, setLayout] = useState({
    name: { visible: true, x: 50, y: 45, fontSize: 32, color: "#0f172a", bold: true },
    event: { visible: true, x: 50, y: 55, fontSize: 18, color: "#334155", bold: false },
    date: { visible: true, x: 25, y: 80, fontSize: 13, color: "#64748b", bold: false },
    certId: { visible: true, x: 50, y: 88, fontSize: 11, color: "#94a3b8", bold: false },
    qr: { visible: true, x: 75, y: 78, size: 70 },
  });

  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCertificatesList = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      if (res.ok && data?.certificates) {
        setIssuedCertificates(data.certificates);
      }
    } catch (err) {
      console.error("Failed to load certificates list:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    const randomId = "CERT-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const today = new Date().toISOString().split("T")[0];

    setCertData((prev) => ({
      ...prev,
      certificateId: randomId,
      issueDate: today,
    }));

    // Load saved templates
    const saved = localStorage.getItem("devsoc_saved_templates");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTemplates(parsed);
        if (parsed.length > 0) {
          setSelectedTemplate(parsed[0]);
          setTemplateUrl(parsed[0].templateUrl);
          setLayout(parsed[0].layout);
        }
      } catch (err) {
        console.error("Error loading templates:", err);
      }
    }

    fetchCertificatesList();
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
        Loading Certificate Studio...
      </div>
    );
  }

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://devsoc-three.vercel.app";
  const qrVerificationUrl = `${siteUrl}/verify?id=${certData.certificateId}`;

  const handleAddCustomText = () => {
    const id = "custom_" + Date.now();
    const updated = {
      ...layout,
      [id]: {
        visible: true,
        text: "Custom Text Here",
        x: 50,
        y: 65,
        fontSize: 16,
        color: "#1e293b",
        bold: false,
      },
    };
    setLayout(updated);
    setSelectedId(id);
  };

  const handleRestoreElement = (key) => {
    setLayout((prev) => ({
      ...prev,
      [key]: { ...prev[key], visible: true },
    }));
    setSelectedId(key);
  };

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setTemplateUrl(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateUrl || !templateName) {
      alert("Please provide a template name and upload a background image.");
      return;
    }

    const newTemplate = {
      id: "tpl_" + Date.now(),
      name: templateName,
      templateUrl,
      layout,
    };

    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem("devsoc_saved_templates", JSON.stringify(updated));
    setSelectedTemplate(newTemplate);
    alert(`Template "${templateName}" saved successfully!`);
  };

  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;
    if (!confirm(`Delete template "${selectedTemplate.name}"?`)) return;

    const updated = templates.filter((tpl) => tpl.id !== selectedTemplate.id);
    setTemplates(updated);
    localStorage.setItem("devsoc_saved_templates", JSON.stringify(updated));

    if (updated.length > 0) {
      setSelectedTemplate(updated[0]);
      setTemplateUrl(updated[0].templateUrl);
      setLayout(updated[0].layout);
    } else {
      setSelectedTemplate(null);
      setTemplateUrl("");
    }
  };

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setTemplateUrl(tpl.templateUrl);
    setLayout(tpl.layout);
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...certData,
      templateUrl,
      layout,
      qrUrl: qrVerificationUrl,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => null);

      if (res.ok) {
        alert(`Certificate issued successfully! ID: ${certData.certificateId}`);
        setCertData((prev) => ({
          ...prev,
          recipientName: "",
          recipientEmail: "",
          certificateId: "CERT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        }));
        fetchCertificatesList();
      } else {
        const errorMsg = responseData?.details || responseData?.error || "Error saving certificate";
        alert(`Failed to save: ${errorMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Network error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Revoke / Reinstate
  const handleToggleRevoke = async (cert) => {
    const certId = cert.certificateId || cert.id || cert.code;
    const newStatus = cert.status === "revoked" ? "valid" : "revoked";

    try {
      const res = await fetch("/api/certificates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: certId, status: newStatus }),
      });
      if (res.ok) {
        setIssuedCertificates((prev) =>
          prev.map((c) =>
            (c.certificateId || c.id || c.code) === certId ? { ...c, status: newStatus } : c
          )
        );
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Delete an issued certificate
  const handleDeleteIssuedCert = async (certId) => {
    if (!confirm(`Are you sure you want to delete certificate ${certId}?`)) return;

    try {
      const res = await fetch(`/api/certificates?id=${encodeURIComponent(certId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIssuedCertificates((prev) =>
          prev.filter((c) => (c.certificateId || c.id || c.code) !== certId)
        );
      }
    } catch (err) {
      alert("Failed to delete certificate");
    }
  };

  const filteredCertificates = issuedCertificates.filter((c) => {
    const q = searchQuery.toLowerCase();
    const name = (c.recipientName || c.name || "").toLowerCase();
    const event = (c.eventName || c.event || "").toLowerCase();
    const id = (c.certificateId || c.id || c.code || "").toLowerCase();
    return name.includes(q) || event.includes(q) || id.includes(q);
  });

  const currentEl = selectedId ? layout[selectedId] : null;

  return (
    <div className="space-y-12 p-6 max-w-7xl mx-auto text-white">
      {/* SECTION 1: STUDIO */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Certificate Studio & Issuance
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload custom Canva templates, drag to position, scale text/QR code, add custom text boxes, or delete baked-in elements.
          </p>
        </div>

        {/* Template Upload & Management */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-2">1. Upload Canva Template</label>
            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-800/40 transition">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs text-slate-300">Click to upload JPG / PNG</span>
              <input type="file" accept="image/*" onChange={handleTemplateUpload} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-2">2. Saved Templates</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
                  onChange={(e) => {
                    const found = templates.find((t) => t.id === e.target.value);
                    if (found) handleSelectTemplate(found);
                    else {
                      setSelectedTemplate(null);
                      setTemplateUrl("");
                    }
                  }}
                  value={selectedTemplate?.id || ""}
                >
                  <option value="">-- Choose Existing Template --</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>

                {selectedTemplate && (
                  <button
                    type="button"
                    onClick={handleDeleteTemplate}
                    className="bg-rose-950/60 border border-rose-800/60 hover:bg-rose-600 hover:text-white text-rose-400 px-3 rounded-lg text-xs font-medium flex items-center gap-1 transition"
                    title="Delete current template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                />
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex flex-col justify-center space-y-1.5 border-l border-slate-800 pl-4">
            <p className="font-semibold text-slate-300">Canvas Controls:</p>
            <p>• Click an element to select it.</p>
            <p>• Drag the <span className="text-rose-400 font-semibold">[X]</span> to delete, or drag the bottom-right corner <span className="text-indigo-400 font-semibold">[↘]</span> to resize.</p>
            <p>• All form fields are completely optional.</p>
          </div>
        </div>

        {/* Element Toolbar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddCustomText}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Add Custom Text
            </button>

            <div className="flex items-center gap-1 border-l border-slate-700 pl-3">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Restore:
              </span>
              {["name", "event", "date", "certId", "qr"].map((key) => {
                if (layout[key]?.visible !== false) return null;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleRestoreElement(key)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs capitalize border border-slate-700"
                  >
                    +{key}
                  </button>
                );
              })}
            </div>
          </div>

          {currentEl && (
            <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="font-semibold text-indigo-400 capitalize flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Editing: {selectedId}
              </span>

              {selectedId.startsWith("custom_") && (
                <input
                  type="text"
                  value={currentEl.text || ""}
                  onChange={(e) =>
                    setLayout({
                      ...layout,
                      [selectedId]: { ...currentEl, text: e.target.value },
                    })
                  }
                  className="bg-slate-900 border border-slate-600 rounded px-2 py-0.5 text-xs text-white"
                  placeholder="Text value"
                />
              )}

              {/* Font / QR Size */}
{selectedId === "qr" ? (
  <div className="flex items-center gap-1">
    <span>Size:</span>
    <input
      type="range"
      min="30"
      max="300"
      value={currentEl.size || 75}
      onChange={(e) =>
        setLayout({
          ...layout,
          qr: { ...currentEl, size: Number(e.target.value) },
        })
      }
      className="w-24"
    />
    <span className="font-mono text-slate-400">{currentEl.size || 75}px</span>
  </div>
) : (
  <>
    <div className="flex items-center gap-1">
      <span>Size:</span>
      <input
        type="range"
        min="10"
        max="180"
        value={currentEl.fontSize || 24}
        onChange={(e) =>
          setLayout({
            ...layout,
            [selectedId]: { ...currentEl, fontSize: Number(e.target.value) },
          })
        }
        className="w-24"
      />
      <span className="font-mono text-slate-400">{currentEl.fontSize || 24}px</span>
    </div>

                  <div className="flex items-center gap-1">
                    <span>Color:</span>
                    <input
                      type="color"
                      value={currentEl.color || "#000000"}
                      onChange={(e) =>
                        setLayout({
                          ...layout,
                          [selectedId]: { ...currentEl, color: e.target.value },
                        })
                      }
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setLayout({
                        ...layout,
                        [selectedId]: { ...currentEl, bold: !currentEl.bold },
                      })
                    }
                    className={`px-2 py-0.5 rounded border ${
                      currentEl.bold ? "bg-indigo-600 border-indigo-500 font-bold" : "bg-slate-700 border-slate-600"
                    }`}
                  >
                    B
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Live Canvas & Details Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <CertificateCanvas
              templateUrl={templateUrl}
              data={certData}
              layout={layout}
              isEditable={true}
              onLayoutChange={setLayout}
              qrUrl={qrVerificationUrl}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>

          <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4 text-slate-200">Participant Details (Optional)</h2>
            <form onSubmit={handleIssueCertificate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Participant / Student Name</label>
                <input
                  type="text"
                  placeholder="Optional (leave empty if on template)"
                  value={certData.recipientName}
                  onChange={(e) => setCertData({ ...certData, recipientName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Event / Activity Name</label>
                <input
                  type="text"
                  placeholder="Optional (leave empty if on template)"
                  value={certData.eventName}
                  onChange={(e) => setCertData({ ...certData, eventName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Issue Date</label>
                  <input
                    type="date"
                    value={certData.issueDate}
                    onChange={(e) => setCertData({ ...certData, issueDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Certificate ID</label>
                  <input
                    type="text"
                    readOnly
                    value={certData.certificateId}
                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5 text-sm font-mono text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={saving || !templateUrl}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Publish & Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* SECTION 2: ISSUED CERTIFICATES LIST */}
      <div className="space-y-4 pt-8 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Issued Certificates</h2>
            <p className="text-xs text-slate-400">
              Total {issuedCertificates.length} certificates registered in the verification system.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, event, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Certificate Cards List */}
        <div className="space-y-3">
          {loadingList ? (
            <div className="text-center py-10 text-slate-500 text-xs">Loading certificates...</div>
          ) : filteredCertificates.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
              No certificates match your search query.
            </div>
          ) : (
            filteredCertificates.map((cert) => {
              const id = cert.certificateId || cert.id || cert.code;
              const name = cert.recipientName || cert.name || "Participant";
              const event = cert.eventName || cert.event || "Activity";
              const date = cert.issueDate || cert.date || "N/A";
              const isRevoked = cert.status === "revoked";

              return (
                <div
                  key={id}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700/80 transition"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-semibold text-cyan-400 tracking-wider">
                      {id}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">{name}</h3>
                    <p className="text-xs text-slate-400">
                      {event} · issued {date} by DevSoc
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        isRevoked
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {isRevoked ? "revoked" : "valid"}
                    </span>

                    {/* QR / Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewCert(cert)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium transition"
                    >
                      QR / Preview
                    </button>

                    {/* Download PDF / Open Verify Button */}
                    <a
                      href={`/verify?id=${encodeURIComponent(id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-md shadow-cyan-500/20 transition flex items-center gap-1"
                    >
                      Download PDF
                    </a>

                    {/* Revoke / Reinstate */}
                    <button
                      type="button"
                      onClick={() => handleToggleRevoke(cert)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium transition"
                    >
                      {isRevoked ? "Reinstate" : "Revoke"}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteIssuedCert(id)}
                      className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 hover:border-rose-700 px-3 py-1.5 rounded-full text-xs font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* POPUP MODAL: QR & Canvas Preview */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {previewCert.recipientName || previewCert.name || "Certificate Preview"}
                </h3>
                <p className="text-xs font-mono text-cyan-400">
                  {previewCert.certificateId || previewCert.id || previewCert.code}
                </p>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-w-xl mx-auto">
              <CertificateCanvas
                templateUrl={previewCert.templateUrl}
                data={previewCert}
                layout={previewCert.layout || {}}
                isEditable={false}
                qrUrl={
                  previewCert.qrUrl ||
                  `${siteUrl}/verify?id=${previewCert.certificateId || previewCert.id || previewCert.code}`
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <a
                href={`/verify?id=${encodeURIComponent(previewCert.certificateId || previewCert.id || previewCert.code)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Public Verification Page
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}