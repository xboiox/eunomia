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

function UsersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tenantId = searchParams.get("tenantId") ?? "";

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "ASSESSOR">("ASSESSOR");
  const [inviting, setInviting] = useState(false);

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

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, tenantId, role: inviteRole }),
    });
    const data = await res.json();
    setInviting(false);
    if (!res.ok) { toast.error(data.error ?? "Failed"); return; }
    toast.success("User added!");
    setInviteEmail("");
    setMembers((prev) => [...prev, { ...data.data }]);
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

      {/* Tenant selector */}
      <div className="mt-4">
        <select
          value={tenantId}
          onChange={(e) => router.push(`/dashboard/users?tenantId=${e.target.value}`)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
        >
          <option value="">Select organization…</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {tenantId && (
        <>
          {/* Invite form */}
          <form onSubmit={handleInvite} className="mt-6 flex gap-3">
            <input
              type="email" required placeholder="user@example.com" value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
            />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as "ADMIN" | "ASSESSOR")}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-white">
              <option value="ASSESSOR">Assessor</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button type="submit" disabled={inviting}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400">
              {inviting ? "Adding…" : "Add User"}
            </button>
          </form>

          {/* Members table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            {loading ? (
              <p className="p-6 text-sm text-gray-500">Loading…</p>
            ) : members.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">No members yet. Invite someone above.</p>
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
                        <button onClick={() => handleRemove(m.id)}
                          className="text-xs text-red-500 hover:text-red-700 dark:text-red-400">
                          Remove
                        </button>
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
