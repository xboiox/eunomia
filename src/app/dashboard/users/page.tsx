"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";

interface TenantMember {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "ASSESSOR";
}

interface Tenant {
  id: string;
  name: string;
  role: "ADMIN" | "ASSESSOR";
}

interface PasswordModal {
  type: "create" | "reset";
  userName: string;
  password: string;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white";

function PasswordRevealModal({ modal, onClose }: { modal: PasswordModal; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(modal.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {modal.type === "create" ? "User created" : "Password reset"}
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Share this temporary password with <strong>{modal.userName}</strong>. It will not be
          shown again. The user will be required to change it on first login.
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-800 dark:bg-amber-900/20">
          <code className="flex-1 font-mono text-sm font-semibold tracking-wider text-gray-900 dark:text-white">
            {modal.password}
          </code>
          <button
            onClick={copy}
            className="shrink-0 rounded-md bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          I have saved the password
        </button>
      </div>
    </div>
  );
}

function UsersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tenantId = searchParams.get("tenantId") ?? "";

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Create user form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "ASSESSOR">("ASSESSOR");
  const [creating, setCreating] = useState(false);

  // Password modal
  const [passwordModal, setPasswordModal] = useState<PasswordModal | null>(null);

  useEffect(() => {
    fetch("/api/tenants")
      .then((r) => r.json())
      .then((d) => setTenants(d.data ?? []));
  }, []);

  useEffect(() => {
    if (!tenantId) return;
    setLoading(true);
    fetch(`/api/users?tenantId=${tenantId}`)
      .then((r) => r.json())
      .then((d) => { setMembers(d.data ?? []); setLoading(false); });
  }, [tenantId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail, role: newRole, tenantId }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { toast.error(data.error ?? "Failed to create user"); return; }

    setMembers((prev) => [...prev, { id: data.data.id, name: data.data.name, email: data.data.email, role: data.data.role }]);
    setNewName("");
    setNewEmail("");
    setPasswordModal({ type: "create", userName: data.data.name ?? data.data.email, password: data.data.temporaryPassword });
  }

  async function handleResetPassword(member: TenantMember) {
    const res = await fetch(`/api/users/${member.id}/reset-password`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error ?? "Failed to reset password"); return; }
    setPasswordModal({ type: "reset", userName: member.name ?? member.email, password: data.data.temporaryPassword });
  }

  async function handleRemove(userId: string) {
    const res = await fetch(`/api/users/${userId}?tenantId=${tenantId}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to remove user"); return; }
    toast.success("User removed");
    setMembers((prev) => prev.filter((m) => m.id !== userId));
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>

      {passwordModal && (
        <PasswordRevealModal modal={passwordModal} onClose={() => setPasswordModal(null)} />
      )}

      {/* Tenant selector */}
      <div className="mt-4">
        <select
          value={tenantId}
          onChange={(e) => router.push(`/dashboard/users?tenantId=${e.target.value}`)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select organization…</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {tenantId && (
        <>
          {/* Create user form */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Create new user</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              A temporary password will be generated and shown once. The user must change it on first login.
            </p>
            <form onSubmit={handleCreate} className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Name
                <input
                  type="text" required placeholder="Jane Doe"
                  value={newName} onChange={(e) => setNewName(e.target.value)}
                  className={`mt-1 ${inputClass}`}
                />
              </label>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Email
                <input
                  type="email" required placeholder="jane@company.com"
                  value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  className={`mt-1 ${inputClass}`}
                />
              </label>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Role
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as "ADMIN" | "ASSESSOR")}
                  className={`mt-1 ${inputClass}`}>
                  <option value="ASSESSOR">Assessor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              <div className="flex items-end">
                <button type="submit" disabled={creating}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {creating ? "Creating…" : "Create user"}
                </button>
              </div>
            </form>
          </div>

          {/* Members table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            {loading ? (
              <p className="p-6 text-sm text-gray-500">Loading…</p>
            ) : members.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">No members yet. Create one above.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    {["Name", "Email", "Role", ""].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{m.name ?? "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{m.email}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          m.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}>{m.role}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleResetPassword(m)}
                            className="text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300">
                            Reset password
                          </button>
                          <button onClick={() => handleRemove(m.id)}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400">
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading…</div>}>
      <UsersContent />
    </Suspense>
  );
}
