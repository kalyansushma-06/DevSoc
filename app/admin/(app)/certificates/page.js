"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

const EMPTY = { certId: "", name: "", issuedFor: "", issuedBy: "", dateIssued: "", status: "valid" };

export default function AdminCertificatesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch("/api/certificates");
    setItems(data.items.sort((a, b) => b.dateIssued.localeCompare(a.dateIssued)));
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminFetch("/api/certificates", { method: "POST", body: JSON.stringify(form) });
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(cert) {
    const next = cert.status === "valid" ? "revoked" : "valid";
    await adminFetch(`/api/certificates/${cert.id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Permanently delete this certificate record?")) return;
    await adminFetch(`/api/certificates/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Certificates</h1>
      <p className="mt-1 text-sm text-white/50">
        Every certificate issued here becomes instantly checkable on the public Verify page.
      </p>

      <form onSubmit={handleSubmit} className="glass-panel mt-6 grid gap-3 p-6 sm:grid-cols-2">
        <input required placeholder="Certificate ID (e.g. DEVSOC-2026-0004)" value={form.certId}
          onChange={(e) => setForm({ ...form, certId: e.target.value })} className="nova-input font-mono sm:col-span-2" />
        <input required placeholder="Recipient name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} className="nova-input" />
        <input required type="date" value={form.dateIssued}
          onChange={(e) => setForm({ ...form, dateIssued: e.target.value })} className="nova-input" />
        <input required placeholder="Issued for (e.g. Orbit Hackathon - Winner)" value={form.issuedFor}
          onChange={(e) => setForm({ ...form, issuedFor: e.target.value })} className="nova-input sm:col-span-2" />
        <input required placeholder="Issued by (your name, role)" value={form.issuedBy}
          onChange={(e) => setForm({ ...form, issuedBy: e.target.value })} className="nova-input sm:col-span-2" />
        <button type="submit" disabled={loading} className="nova-btn-primary sm:col-span-2">
          {loading ? "Issuing..." : "Issue certificate"}
        </button>
        {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
      </form>

      <div className="mt-8 space-y-3">
        {items.map((c) => (
          <div key={c.id} className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-mono text-xs text-nova-cyan">{c.certId}</p>
              <p className="mt-1 font-display text-sm font-semibold">{c.name}</p>
              <p className="text-xs text-white/40">{c.issuedFor} · issued {c.dateIssued} by {c.issuedBy}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`nova-tag ${c.status === "valid" ? "!border-nova-cyan/40 !text-nova-cyan" : "!border-red-400/40 !text-red-300"}`}>
                {c.status}
              </span>
              <button onClick={() => toggleStatus(c)} className="nova-btn-secondary !px-4 !py-1.5 text-xs">
                {c.status === "valid" ? "Revoke" : "Reinstate"}
              </button>
              <button onClick={() => handleDelete(c.id)} className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10">
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/50">No certificates issued yet.</p>}
      </div>
    </div>
  );
}
