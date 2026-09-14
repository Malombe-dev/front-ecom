"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

export default function AdminManagementPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function load() {
    apiFetch("/admin/admins", { auth: true }).then(setAdmins).catch(() => {});
  }
  useEffect(load, []);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await apiFetch("/admin/admins", { method: "POST", auth: true, body: form });
      setForm({ name: "", email: "", password: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggle(id) {
    await apiFetch(`/admin/admins/${id}/deactivate`, { method: "PATCH", auth: true });
    load();
  }

  if (user?.role !== "superadmin") {
    return <p className="text-ink-500">Only the super admin can manage other admins.</p>;
  }

  return (
    <div className="w-full max-w-xl">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink-900">Admin accounts</h1>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 rounded-card border border-ink-300/30 p-4 bg-white shadow-xs">
        <p className="text-sm font-medium text-ink-900">Create a new admin</p>
        <input required placeholder="Name" value={form.name} onChange={update("name")}
          className="rounded-card border border-ink-300/50 px-3 py-2 text-sm" />
        <input required type="email" placeholder="Email" value={form.email} onChange={update("email")}
          className="rounded-card border border-ink-300/50 px-3 py-2 text-sm" />
        <input required type="password" placeholder="Temporary password" value={form.password} onChange={update("password")}
          className="rounded-card border border-ink-300/50 px-3 py-2 text-sm" />
        {error && <p className="text-sm text-danger-600">{error}</p>}
        <button className="rounded-card bg-brand-900 py-2 text-sm font-semibold text-white hover:bg-brand-600">
          Create admin
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {admins.map((a) => (
          <div key={a._id} className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-ink-300/30 p-3 bg-white shadow-xs">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink-900 break-words">{a.name} <span className="text-xs uppercase text-ink-500">({a.role})</span></p>
              <p className="text-sm text-ink-500 break-words">{a.email}</p>
            </div>
            {a.role === "admin" && (
              <button onClick={() => toggle(a._id)} className={`text-sm font-medium hover:underline ${a.isActive ? "text-danger-600" : "text-success-600"}`}>
                {a.isActive ? "Deactivate" : "Reactivate"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
