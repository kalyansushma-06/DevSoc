"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-void-900 px-6">
      <div className="glass-panel w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <Image src="/logo.jpg" alt="DevSoc" width={48} height={48} className="rounded-xl" />
          <h1 className="mt-4 font-display text-xl font-bold">Admin Login</h1>
          <p className="mt-1 text-xs text-white/50">Core team &amp; coordinators only.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="nova-input"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="nova-input"
          />
          <button type="submit" disabled={loading} className="nova-btn-primary mt-2">
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </form>

        <p className="mt-6 text-center text-[11px] text-white/30">
          Default credentials are set in data/admins.json (or via ADMIN_EMAIL /
          ADMIN_PASSWORD in your .env.local — see the seed script).
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-void-900 text-white text-sm">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}