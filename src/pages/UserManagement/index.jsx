import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";

export function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // "all" | "admin" | "user" | "suspended"
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedModalRole, setSelectedModalRole] = useState("user");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Mock principals data
  const [principals, setPrincipals] = useState([
    {
      id: "usr_98f4a12ecb",
      name: "Sarah Chen",
      email: "sarah.chen@authshield.io",
      role: "admin",
      status: "active",
      lastActive: "Just now",
      createdAt: "2026-01-15",
      authType: "Google OAuth",
    },
    {
      id: "usr_34a81bc210",
      name: "Marcus Vance",
      email: "marcus.vance@authshield.io",
      role: "user",
      status: "active",
      lastActive: "14 mins ago",
      createdAt: "2026-02-10",
      authType: "Local Passphrase",
    },
    {
      id: "usr_77ef9901ad",
      name: "Elena Rostova",
      email: "elena.rostova@cyber.io",
      role: "user",
      status: "active",
      lastActive: "2 hours ago",
      createdAt: "2026-03-01",
      authType: "Local Passphrase",
    },
    {
      id: "usr_0099ab34ef",
      name: "David Kim",
      email: "david.kim@fintech.vault",
      role: "admin",
      status: "active",
      lastActive: "1 day ago",
      createdAt: "2026-02-18",
      authType: "Google OAuth",
    },
    {
      id: "usr_88bc2210aa",
      name: "Tariq Mansour",
      email: "tariq.mansour@edge.net",
      role: "user",
      status: "suspended",
      lastActive: "7 days ago",
      createdAt: "2026-01-20",
      authType: "Local Passphrase",
    },
  ]);

  const filteredUsers = principals.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterRole === "all") return true;
    if (filterRole === "admin") return u.role === "admin";
    if (filterRole === "user") return u.role === "user" && u.status === "active";
    if (filterRole === "suspended") return u.status === "suspended";
    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleOpenRoleModal = (user) => {
    setRoleModalUser(user);
    setSelectedModalRole(user.role);
    setActiveMenuId(null);
  };

  const handleSaveRole = () => {
    if (!roleModalUser) return;
    setPrincipals((prev) =>
      prev.map((u) => (u.id === roleModalUser.id ? { ...u, role: selectedModalRole } : u))
    );
    setRoleModalUser(null);
    triggerToast(`Role for ${roleModalUser.name} updated to ${selectedModalRole.toUpperCase()}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-headline text-[#dae2fd] tracking-tight">
              Identity Registry & RBAC
            </h1>
            <Badge variant="admin">12,480 Principals</Badge>
          </div>
          <p className="text-xs text-[#c7c4d7]">
            Governed credential ledger, granular scope mapping, and active cryptographic session validation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={<span className="material-symbols-outlined text-[16px] text-[#d0bcff]">file_download</span>}
            onClick={() => triggerToast("Exported identities as authshield-principals.csv")}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<span className="material-symbols-outlined text-[16px]">person_add</span>}
            onClick={() => triggerToast("Identity provisioning modal initialized.")}
          >
            Provision Identity
          </Button>
        </div>
      </div>

      {/* Quick Stat Pill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center justify-between p-4">
          <div>
            <span className="text-[11px] font-mono text-[#908fa0] uppercase">Total Principals</span>
            <p className="text-xl font-bold font-headline text-[#dae2fd]">12,480</p>
            <span className="text-[11px] text-[#4edea3] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> +142 this week
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#222a3d] flex items-center justify-center text-[#8083ff]">
            <span className="material-symbols-outlined text-[20px]">group</span>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div>
            <span className="text-[11px] font-mono text-[#908fa0] uppercase">Superuser Admins</span>
            <p className="text-xl font-bold font-headline text-[#d0bcff]">18</p>
            <span className="text-[11px] text-[#c7c4d7] mt-0.5">Tier 0 & Tier 1 Access</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#571bc1]/30 flex items-center justify-center text-[#d0bcff]">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div>
            <span className="text-[11px] font-mono text-[#908fa0] uppercase">Active JWT Claims</span>
            <p className="text-xl font-bold font-headline text-[#4edea3]">3,892</p>
            <span className="text-[11px] text-[#4edea3] flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" /> Zero Drift Detected
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#00885d]/20 flex items-center justify-center text-[#4edea3]">
            <span className="material-symbols-outlined text-[20px]">token</span>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div>
            <span className="text-[11px] font-mono text-[#908fa0] uppercase">Suspended / Locked</span>
            <p className="text-xl font-bold font-headline text-[#ffb4ab]">3</p>
            <span className="text-[11px] text-[#ffb4ab] mt-0.5">Automated policy halt</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#93000a]/20 flex items-center justify-center text-[#ffb4ab]">
            <span className="material-symbols-outlined text-[20px]">block</span>
          </div>
        </Card>
      </div>

      {/* Main Ledger Table Card */}
      <Card>
        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-[#464554]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="w-full md:w-80">
            <Input
              placeholder="Search by name, email, or UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconLeft={<span className="material-symbols-outlined text-[18px]">search</span>}
              className="py-1.5 text-xs bg-[#060e20]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setFilterRole("all")}
              className={`px-3 py-1 text-xs rounded-lg transition-all font-medium ${
                filterRole === "all"
                  ? "bg-[#8083ff] text-[#0d0096] font-semibold shadow"
                  : "bg-[#222a3d] text-[#c7c4d7] hover:text-[#dae2fd]"
              }`}
            >
              All Principals ({principals.length})
            </button>
            <button
              onClick={() => setFilterRole("admin")}
              className={`px-3 py-1 text-xs rounded-lg transition-all font-medium ${
                filterRole === "admin"
                  ? "bg-[#8083ff] text-[#0d0096] font-semibold shadow"
                  : "bg-[#222a3d] text-[#c7c4d7] hover:text-[#dae2fd]"
              }`}
            >
              Admins Only (2)
            </button>
            <button
              onClick={() => setFilterRole("user")}
              className={`px-3 py-1 text-xs rounded-lg transition-all font-medium ${
                filterRole === "user"
                  ? "bg-[#8083ff] text-[#0d0096] font-semibold shadow"
                  : "bg-[#222a3d] text-[#c7c4d7] hover:text-[#dae2fd]"
              }`}
            >
              Standard Users (2)
            </button>
            <button
              onClick={() => setFilterRole("suspended")}
              className={`px-3 py-1 text-xs rounded-lg transition-all font-medium ${
                filterRole === "suspended"
                  ? "bg-[#8083ff] text-[#0d0096] font-semibold shadow"
                  : "bg-[#222a3d] text-[#c7c4d7] hover:text-[#dae2fd]"
              }`}
            >
              Suspended (1)
            </button>
          </div>
        </div>

        {/* Bulk Action Bar (when selected) */}
        {selectedIds.length > 0 && (
          <div className="bg-[#8083ff]/15 border-b border-[#8083ff]/30 px-4 py-2.5 flex items-center justify-between text-xs animate-in fade-in">
            <span className="text-[#c0c1ff] font-semibold">
              {selectedIds.length} principals selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => triggerToast(`Emitted JWT revocation for ${selectedIds.length} users.`)}
              >
                Revoke Active JWT
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => triggerToast(`Suspension prompt dispatched for ${selectedIds.length} users.`)}
              >
                Suspend Principals
              </Button>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#464554]/30 text-[#908fa0] font-mono uppercase bg-[#060e20]/40">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredUsers.length && filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-[#464554] bg-[#060e20] text-[#8083ff] focus:ring-0"
                  />
                </th>
                <th className="py-3 px-4 font-semibold">Principal & Identity</th>
                <th className="py-3 px-4 font-semibold">Assigned Role</th>
                <th className="py-3 px-4 font-semibold">Auth Type</th>
                <th className="py-3 px-4 font-semibold">State</th>
                <th className="py-3 px-4 font-semibold">Last Active</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#464554]/20">
              {filteredUsers.map((user) => {
                const isSelected = selectedIds.includes(user.id);
                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-[#171f33]/60 transition-colors ${
                      isSelected ? "bg-[#8083ff]/5" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(user.id)}
                        className="rounded border-[#464554] bg-[#060e20] text-[#8083ff] focus:ring-0"
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#222a3d] border border-[#464554]/50 flex items-center justify-center font-bold text-[#c0c1ff] shrink-0">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-[#dae2fd]">{user.name}</p>
                          <p className="text-[11px] text-[#908fa0] font-mono">{user.email}</p>
                          <span className="text-[10px] text-[#908fa0] font-mono">UID: {user.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={user.role === "admin" ? "admin" : "user"}>
                        {user.role === "admin" ? "Superuser Admin" : "Standard User"}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#c7c4d7]">
                      {user.authType}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 font-medium ${
                          user.status === "active" ? "text-[#4edea3]" : "text-[#ffb4ab]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "active" ? "bg-[#4edea3]" : "bg-[#ffb4ab]"
                          }`}
                        />
                        {user.status === "active" ? "Verified" : "Suspended"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#908fa0] font-mono">{user.lastActive}</td>

                    <td className="py-3.5 px-4 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                          className="p-1.5 rounded-lg text-[#908fa0] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>

                        {activeMenuId === user.id && (
                          <div
                            className="absolute right-4 mt-1 w-44 rounded-xl bg-[#131b2e] border border-[#464554]/60 shadow-2xl p-1 z-50 text-left animate-in fade-in zoom-in-95"
                            onClick={() => setActiveMenuId(null)}
                          >
                            <button
                              onClick={() => handleOpenRoleModal(user)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#dae2fd] hover:bg-[#222a3d] rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-[15px] text-[#c0c1ff]">
                                security
                              </span>
                              Edit Role Policy
                            </button>
                            <button
                              onClick={() => triggerToast(`Issued fresh session audit for ${user.name}`)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#dae2fd] hover:bg-[#222a3d] rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-[15px] text-[#4edea3]">
                                key
                              </span>
                              Audit Active Tokens
                            </button>
                            <button
                              onClick={() => triggerToast(`Revoked all bearer tokens for ${user.name}`)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#ffb4ab] hover:bg-[#93000a]/20 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                block
                              </span>
                              Revoke Session
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-[#464554]/30 flex items-center justify-between text-xs text-[#908fa0]">
          <span>Showing {filteredUsers.length} of 12,480 recorded principals</span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled>
              Previous
            </Button>
            <Button variant="secondary" size="sm">
              Next Page
            </Button>
          </div>
        </div>
      </Card>

      {/* Role Policy Edit Modal */}
      <Modal
        isOpen={!!roleModalUser}
        onClose={() => setRoleModalUser(null)}
        title="Modify Role Privilege Policy"
        subtitle={`Updating authorization matrix for ${roleModalUser?.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRoleModalUser(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveRole}>
              Apply & Commit Policy
            </Button>
          </>
        }
      >
        {roleModalUser && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#060e20] border border-[#464554]/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#222a3d] flex items-center justify-center font-bold text-[#c0c1ff]">
                {roleModalUser.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-xs text-[#dae2fd]">{roleModalUser.name}</p>
                <p className="text-[11px] text-[#908fa0] font-mono">{roleModalUser.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#908fa0]">
                Select Privilege Tier
              </label>

              <div className="space-y-2">
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedModalRole === "admin"
                      ? "bg-[#8083ff]/15 border-[#8083ff] shadow-sm"
                      : "bg-[#171f33] border-[#464554]/40 hover:border-[#908fa0]/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={selectedModalRole === "admin"}
                    onChange={() => setSelectedModalRole("admin")}
                    className="mt-1 text-[#8083ff] focus:ring-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#dae2fd]">
                        Superuser Administrator (`role: "admin"`)
                      </span>
                      <Badge variant="admin">Full Control</Badge>
                    </div>
                    <p className="text-[11px] text-[#908fa0] mt-0.5">
                      Full access to <code className="text-[#c0c1ff]">/api/auth/admin/dashboard</code>, security metrics, and IAM provisioning.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedModalRole === "user"
                      ? "bg-[#8083ff]/15 border-[#8083ff] shadow-sm"
                      : "bg-[#171f33] border-[#464554]/40 hover:border-[#908fa0]/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={selectedModalRole === "user"}
                    onChange={() => setSelectedModalRole("user")}
                    className="mt-1 text-[#8083ff] focus:ring-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#dae2fd]">
                        Standard Identity (`role: "user"`)
                      </span>
                      <Badge variant="user">Restricted</Badge>
                    </div>
                    <p className="text-[11px] text-[#908fa0] mt-0.5">
                      Can view personal profile (<code className="text-[#c0c1ff]">/api/auth/me</code>) and change password. Blocked from admin routes.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default UserManagementPage;
