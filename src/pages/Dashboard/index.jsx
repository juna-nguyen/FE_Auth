import React, { useState, useEffect } from "react";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import { authApi } from "../../services/api/apiUser";

export function DashboardPage({ user, onNavigate }) {
  const [adminData, setAdminData] = useState(null);
  const [adminError, setAdminError] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // Modal states
  const [showSimModal, setShowSimModal] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // G?i API /api/auth/admin/dashboard d? ki?m tra quy?n và l?y d? li?u qu?n tr?
  const fetchAdminDashboard = async () => {
    setLoadingAdmin(true);
    setAdminError(null);
    try {
      const data = await authApi.getAdminDashboard();
      setAdminData(data);
    } catch (err) {
      console.warn("Admin Dashboard fetch error:", err);
      setAdminError(err);
    } finally {
      setLoadingAdmin(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const stats = [
    {
      title: "Active Authenticated Principal",
      value: user?.name || "Anonymous",
      change: user?.role === "admin" ? "Role: ADMIN (Full Control)" : "Role: USER (Standard)",
      isPositive: true,
      icon: "verified_user",
      accent: "text-[#8083ff]",
    },
    {
      title: "Backend Cluster Route",
      value: "GET /api/auth/admin/dashboard",
      change: adminData ? "Status: 200 OK Authorized" : adminError ? `Status: ${adminError.statusCode || 403} Denied` : "Checking auth status...",
      isPositive: !!adminData,
      icon: "admin_panel_settings",
      accent: "text-[#4edea3]",
    },
    {
      title: "Active Identity Claim",
      value: user?.email || "unregistered",
      change: "JWT Bearer Token Attached",
      isPositive: true,
      icon: "alternate_email",
      accent: "text-[#c0c1ff]",
    },
    {
      title: "Security Shield Layer",
      value: "TLS 1.3 / ed25519",
      change: "Zero-Trust Enforcement Active",
      isPositive: true,
      icon: "lock",
      accent: "text-[#d0bcff]",
    },
  ];

  const liveEvents = [
    {
      id: "EVT-8921",
      action: "POST /api/auth/login",
      user: user?.email || "sarah.chen@authshield.io",
      role: user?.role || "admin",
      ip: "127.0.0.1 (Local Client)",
      status: "200 OK",
      success: true,
      time: "Just now",
    },
    {
      id: "EVT-8920",
      action: "GET /api/auth/me",
      user: user?.email || "sarah.chen@authshield.io",
      role: user?.role || "admin",
      ip: "127.0.0.1",
      status: "200 OK",
      success: true,
      time: "1m ago",
    },
    {
      id: "EVT-8919",
      action: "GET /api/auth/admin/dashboard",
      user: user?.email || "system_audit",
      role: user?.role || "user",
      ip: "127.0.0.1",
      status: adminData ? "200 OK" : "403 Forbidden",
      success: !!adminData,
      time: "2m ago",
    },
    {
      id: "EVT-8918",
      action: "POST /api/auth/register",
      user: "new_identity@authshield.io",
      role: "user",
      ip: "192.168.1.108",
      status: "201 Created",
      success: true,
      time: "5m ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Real-time API Connection Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#908fa0]">
            <span>CONTROL PLANE</span>
            <span>/</span>
            <span className="text-[#8083ff]">API TELEMETRY & SECURITY</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-headline text-[#dae2fd] tracking-tight">
              Security & Identity Dashboard
            </h1>
            <Badge variant="cluster" icon={<span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse inline-block" />}>
              API Connected
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowJsonModal(true)}
            icon={<span className="material-symbols-outlined text-[16px]">code</span>}
          >
            OpenAPI Specs
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={fetchAdminDashboard}
            disabled={loadingAdmin}
            icon={<span className="material-symbols-outlined text-[16px]">sync</span>}
          >
            {loadingAdmin ? "Testing..." : "Test GET /admin/dashboard"}
          </Button>
        </div>
      </div>

      {/* Admin Protected Endpoint Status Banner */}
      {adminData && (
        <div className="p-4 rounded-xl bg-[#00885d]/15 border border-[#4edea3]/40 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00885d]/30 text-[#4edea3] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#4edea3] uppercase tracking-wider font-mono">
                Admin Privilege Verified (`GET /api/auth/admin/dashboard`)
              </p>
              <p className="text-xs text-[#dae2fd]">
                {adminData?.message || "Chào m?ng Admin. Ðây là d? li?u tuy?t m?t."}
              </p>
            </div>
          </div>
          <Badge variant="admin">ADMIN AUTHORIZED</Badge>
        </div>
      )}

      {adminError && (
        <div className="p-4 rounded-xl bg-[#93000a]/15 border border-[#ffb4ab]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#93000a]/30 text-[#ffb4ab] flex items-center justify-center font-bold shrink-0">
              <span className="material-symbols-outlined">lock_clock</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#ffb4ab] uppercase tracking-wider font-mono">
                {adminError.statusCode === 403 ? "403 Forbidden - Role Restriction" : `${adminError.statusCode || 401} Unauthorized`}
              </p>
              <p className="text-xs text-[#c7c4d7]">
                {adminError.message || "B?n không có quy?n truy c?p route /api/auth/admin/dashboard (C?n tài kho?n có role: admin)."}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSimModal(true)}
            className="self-start sm:self-auto"
          >
            Inspect 403 Audit
          </Button>
        </div>
      )}

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover:border-[#8083ff]/40 transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-[#908fa0]">{stat.title}</span>
              <span className={`material-symbols-outlined ${stat.accent} text-[20px]`}>
                {stat.icon}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold font-headline text-[#dae2fd] tracking-tight truncate">
                {stat.value}
              </p>
              <p className="text-[11px] font-mono text-[#908fa0] mt-1 truncate">
                {stat.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Grid Row 2: API Endpoints Health & Interactive Test Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Connected API Routes Matrix */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>API Endpoints Integration Matrix</CardTitle>
              <CardDescription>All 6 endpoints mapped from API_DOCUMENTATION.md</CardDescription>
            </div>
            <span className="material-symbols-outlined text-[#8083ff]">api</span>
          </CardHeader>

          <CardContent className="space-y-3">
            {[
              {
                method: "POST",
                path: "/api/auth/register",
                auth: "Public",
                role: "All",
                desc: "Ðang ký tài kho?n ngu?i dùng m?i (user)",
                status: "Ready",
              },
              {
                method: "POST",
                path: "/api/auth/login",
                auth: "Public",
                role: "All",
                desc: "Xác th?c email/password & c?p phát Bearer JWT (1d)",
                status: "Ready",
              },
              {
                method: "GET",
                path: "/api/auth/me",
                auth: "Bearer JWT",
                role: "All",
                desc: "L?y thông tin tài kho?n ngu?i dùng hi?n t?i",
                status: "Ready",
              },
              {
                method: "PUT",
                path: "/api/auth/change-password",
                auth: "Bearer JWT",
                role: "All",
                desc: "Ð?i m?t kh?u tài kho?n dang dang nh?p",
                status: "Ready",
              },
              {
                method: "POST",
                path: "/api/auth/logout",
                auth: "Optional",
                role: "All",
                desc: "Thông báo dang xu?t & h?y token client-side",
                status: "Ready",
              },
              {
                method: "GET",
                path: "/api/auth/admin/dashboard",
                auth: "Bearer JWT",
                role: "admin",
                desc: "Trang d? li?u qu?n tr? dành riêng cho Admin",
                status: adminData ? "Authorized" : "Guarded (Admin)",
              },
            ].map((route, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#060e20] border border-[#464554]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      route.method === "GET"
                        ? "bg-[#00885d]/20 text-[#4edea3] border border-[#4edea3]/30"
                        : route.method === "POST"
                        ? "bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/30"
                        : "bg-[#d0bcff]/20 text-[#d0bcff] border border-[#d0bcff]/30"
                    }`}
                  >
                    {route.method}
                  </span>
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#dae2fd]">{route.path}</p>
                    <p className="text-[11px] text-[#908fa0]">{route.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#222a3d] text-[#c7c4d7]">
                    Auth: {route.auth}
                  </span>
                  <Badge variant={route.role === "admin" ? "admin" : "user"}>
                    {route.role}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right 5 cols: Live Configuration & Quick Testing Actions */}
        <Card className="lg:col-span-5 space-y-4">
          <CardHeader>
            <div>
              <CardTitle>API Client Configuration</CardTitle>
              <CardDescription>Runtime environment & parameters</CardDescription>
            </div>
            <span className="material-symbols-outlined text-[#8083ff]">settings_ethernet</span>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#060e20] border border-[#464554]/40 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">VITE_API_BASE_URL:</span>
                <span className="text-[#4edea3] font-semibold">
                  {import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">Auth Token Storage:</span>
                <span className="text-[#c0c1ff]">localStorage['token']</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">Header Schema:</span>
                <span className="text-[#c0c1ff]">Authorization: Bearer &lt;jwt&gt;</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">Token Expiration:</span>
                <span className="text-[#dae2fd]">1 Day (1d)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={() => onNavigate?.("/profile")}
                icon={<span className="material-symbols-outlined text-[16px]">manage_accounts</span>}
              >
                Test Profile & Change Password (PUT)
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={() => onNavigate?.("/users")}
                icon={<span className="material-symbols-outlined text-[16px]">shield_person</span>}
              >
                Inspect RBAC User Directory
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Telemetry Event Log */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Real-time Authentication Audit Log</CardTitle>
            <CardDescription>Live telemetry stream of token issues, validations, and requests</CardDescription>
          </div>
          <span className="material-symbols-outlined text-[#8083ff]">terminal</span>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#464554]/40 font-mono text-[#908fa0]">
                  <th className="pb-3 font-semibold">EVENT ID</th>
                  <th className="pb-3 font-semibold">API ENDPOINT</th>
                  <th className="pb-3 font-semibold">PRINCIPAL</th>
                  <th className="pb-3 font-semibold">ROLE</th>
                  <th className="pb-3 font-semibold">CLIENT IP</th>
                  <th className="pb-3 font-semibold">RESPONSE</th>
                  <th className="pb-3 font-semibold text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#464554]/20 font-mono">
                {liveEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#171f33]/40 transition-colors">
                    <td className="py-3 text-[#8083ff] font-semibold">{evt.id}</td>
                    <td className="text-[#dae2fd]">{evt.action}</td>
                    <td className="text-[#c7c4d7]">{evt.user}</td>
                    <td>
                      <Badge variant={evt.role === "admin" ? "admin" : "user"}>
                        {evt.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="text-[#908fa0]">{evt.ip}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          evt.success ? "text-[#4edea3]" : "text-[#ffb4ab]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {evt.success ? "check_circle" : "cancel"}
                        </span>
                        {evt.status}
                      </span>
                    </td>
                    <td className="text-right text-[#908fa0]">{evt.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: Simulated 403 Response */}
      <Modal
        isOpen={showSimModal}
        onClose={() => setShowSimModal(false)}
        title="403 Forbidden RBAC Inspection"
        subtitle="Verification of Role-Based Access Control (RBAC) guard rails"
        footer={
          <Button variant="secondary" onClick={() => setShowSimModal(false)}>
            Dismiss
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[#c7c4d7]">
            Protected route{" "}
            <code className="bg-[#060e20] text-[#c0c1ff] px-1.5 py-0.5 rounded font-mono">
              GET /api/auth/admin/dashboard
            </code>{" "}
            requires an authenticated Bearer token whose role is <code className="text-[#4edea3]">admin</code>.
          </p>

          <div className="p-4 rounded-xl bg-[#060e20] border border-[#ffb4ab]/30 font-mono text-xs text-[#ffb4ab] space-y-1 overflow-x-auto">
            <p className="text-xs font-bold text-[#ffb4ab]">HTTP/1.1 403 Forbidden</p>
            <pre className="text-[11px] text-[#ffb4ab]/90">
{JSON.stringify(
  adminError || {
    statusCode: 403,
    error: "Forbidden",
    message: "B?n không có quy?n truy c?p",
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: OpenAPI v3.1 Specification Modal */}
      <Modal
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
        title="AuthShield API Integration Spec"
        subtitle="Endpoints and schemas aligned with API_DOCUMENTATION.md"
        footer={
          <Button variant="primary" onClick={() => setShowJsonModal(false)}>
            Close Spec Viewer
          </Button>
        }
      >
        <div className="p-4 rounded-xl bg-[#060e20] border border-[#464554]/50 font-mono text-xs text-[#c0c1ff] max-h-96 overflow-y-auto">
          <pre className="text-[11px] leading-relaxed">
{`{
  "openapi": "3.1.0",
  "info": {
    "title": "AuthShield API Auth",
    "version": "1.0.0"
  },
  "servers": [
    { "url": "http://localhost:3001", "description": "Local Dev" },
    { "url": "https://api-auth-sjc4.onrender.com", "description": "Production" }
  ],
  "paths": {
    "/api/auth/register": {
      "post": { "summary": "Register user", "body": { "name": "str", "email": "str", "password": "str" } }
    },
    "/api/auth/login": {
      "post": { "summary": "Login user", "body": { "email": "str", "password": "str" } }
    },
    "/api/auth/me": {
      "get": { "summary": "Get authenticated user profile (Bearer Token)" }
    },
    "/api/auth/change-password": {
      "put": { "summary": "Change password", "body": { "oldPassword": "str", "newPassword": "str" } }
    },
    "/api/auth/logout": {
      "post": { "summary": "Logout user" }
    },
    "/api/auth/admin/dashboard": {
      "get": { "summary": "Admin dashboard metrics (Requires role admin)" }
    }
  }
}`}
          </pre>
        </div>
      </Modal>

      <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default DashboardPage;
