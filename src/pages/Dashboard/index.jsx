import React, { useState } from "react";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import { authApi } from "../../services/api/apiUser";

export function DashboardPage({ user, onNavigate }) {
  const [showSimModal, setShowSimModal] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [adminTestData, setAdminTestData] = useState(null);
  const [adminError, setAdminError] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const isAdmin = user?.role === "admin";
  const userInitials = (user?.name || "User")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AS";

  // Thử nghiệm gọi API quản trị viên GET /api/auth/admin/dashboard
  const handleTestAdminEndpoint = async () => {
    setAdminLoading(true);
    setAdminError(null);
    setAdminTestData(null);

    try {
      const res = await authApi.getAdminDashboard();
      setAdminTestData(res);
      setShowSimModal(true);
      triggerToast(res?.message || "Admin Telemetry retrieved successfully!", "success");
    } catch (err) {
      console.warn("RBAC Admin Route Verification:", err);
      setAdminError(err);
      setShowSimModal(true);
      triggerToast(err?.message || "Truy cập bị từ chối (403 Forbidden)", "error");
    } finally {
      setAdminLoading(false);
    }
  };

  const liveEvents = [
    {
      id: "evt_9918",
      action: "JWT Bearer Issuance",
      user: user?.email || "principal@authshield.io",
      role: user?.role || "user",
      ip: "127.0.0.1 (Loopback)",
      status: "200 OK",
      time: "Vừa xong",
      success: true,
    },
    {
      id: "evt_9917",
      action: "Profile Introspection (/api/auth/me)",
      user: user?.email || "principal@authshield.io",
      role: user?.role || "user",
      ip: "127.0.0.1 (Loopback)",
      status: "200 OK",
      time: "1 phút trước",
      success: true,
    },
    {
      id: "evt_9916",
      action: "RBAC Admin Enforcement (/api/auth/admin/dashboard)",
      user: "guest_probe@scanner.net",
      role: "anonymous",
      ip: "198.51.100.44",
      status: "401 Unauthorized",
      time: "4 phút trước",
      success: false,
    },
    {
      id: "evt_9915",
      action: "Google Identity OAuth2 Exchange",
      user: "dev-lead@authshield.io",
      role: "admin",
      ip: "10.0.4.12",
      status: "200 OK",
      time: "12 phút trước",
      success: true,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Status & User Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#FFEBF1] via-[#FFF0F5] to-[#FFFFFF] border border-[#FAD6DF] shadow-[0_8px_24px_rgba(233,114,150,0.08)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF8DA1] to-[#FF69B4] text-white flex items-center justify-center font-headline font-bold text-xl shadow-[0_4px_14px_rgba(255,105,180,0.35)] shrink-0">
            {userInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-headline text-[#4A353A]">
                Xin chào, {user?.name || "Principal"}
              </h2>
              <Badge variant={isAdmin ? "admin" : "user"}>
                {isAdmin ? "ADMINISTRATOR" : "STANDARD USER"}
              </Badge>
            </div>
            <p className="text-xs text-[#7D676E] mt-0.5">
              Email: <span className="font-mono text-[#4A353A] font-semibold">{user?.email || "Chưa xác thực"}</span> • Token Type: <span className="font-mono text-[#D84A75] font-semibold">Bearer (HMAC-SHA256)</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowJsonModal(true)}
            icon={<span className="material-symbols-outlined text-[16px]">code</span>}
          >
            OpenAPI Spec
          </Button>

          <Button
            variant={isAdmin ? "admin" : "secondary"}
            size="sm"
            isLoading={adminLoading}
            onClick={handleTestAdminEndpoint}
            icon={<span className="material-symbols-outlined text-[16px]">verified_user</span>}
          >
            Test Admin RBAC (/admin/dashboard)
          </Button>
        </div>
      </div>

      {/* Metrics Row (Pastel Pink) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D676E]">
              Active Principals
            </span>
            <span className="p-2 rounded-xl bg-[#FFEBF1] text-[#D84A75]">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#4A353A] font-headline">12,480</span>
            <span className="text-xs font-bold text-[#1B7A5C] flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-[#7D676E] mt-1 font-mono">Real-time JWT sessions</p>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D676E]">
              Token Invocations
            </span>
            <span className="p-2 rounded-xl bg-[#E8F8F5] text-[#1B7A5C]">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#4A353A] font-headline">99.98%</span>
            <Badge variant="success" className="text-[10px]">HEALTHY</Badge>
          </div>
          <p className="text-[11px] text-[#7D676E] mt-1 font-mono">HMAC signature success rate</p>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D676E]">
              API Response Latency
            </span>
            <span className="p-2 rounded-xl bg-[#FFF8E6] text-[#B45309]">
              <span className="material-symbols-outlined text-[18px]">speed</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#4A353A] font-headline">18 ms</span>
            <span className="text-xs text-[#7D676E] font-mono">p99 avg</span>
          </div>
          <p className="text-[11px] text-[#7D676E] mt-1 font-mono">Express Node.js cluster</p>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D676E]">
              RBAC Threat Level
            </span>
            <span className="p-2 rounded-xl bg-[#FFEBF0] text-[#C8234D]">
              <span className="material-symbols-outlined text-[18px]">security</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1B7A5C] font-headline">LOW</span>
            <span className="text-xs text-[#7D676E]">0 active breaches</span>
          </div>
          <p className="text-[11px] text-[#7D676E] mt-1 font-mono">403 guard-rails active</p>
        </Card>
      </div>

      {/* Main Row: RBAC Status Box & API Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* API Architecture Overview */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Auth & Security Architecture</CardTitle>
                <CardDescription>
                  Tổng quan về cơ chế bảo mật và giao thức JWT đang kích hoạt
                </CardDescription>
              </div>
              <Badge variant="cluster">mTLS Active</Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#4A353A]">
                    <span>POST /api/auth/login</span>
                    <Badge variant="success" className="text-[9px]">200 OK</Badge>
                  </div>
                  <p className="text-[#7D676E] text-[11px]">
                    Xác thực thông tin và cấp phát Access Token 24h.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#4A353A]">
                    <span>POST /api/auth/register</span>
                    <Badge variant="primary" className="text-[9px]">201 CREATED</Badge>
                  </div>
                  <p className="text-[#7D676E] text-[11px]">
                    Đăng ký tài khoản mới với vai trò mặc định `role: "user"`.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#4A353A]">
                    <span>GET /api/auth/me</span>
                    <Badge variant="user" className="text-[9px]">BEARER AUTH</Badge>
                  </div>
                  <p className="text-[#7D676E] text-[11px]">
                    Lấy thông tin tài khoản hiện tại từ JWT Header.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#4A353A]">
                    <span>GET /admin/dashboard</span>
                    <Badge variant="admin" className="text-[9px]">ADMIN ONLY</Badge>
                  </div>
                  <p className="text-[#7D676E] text-[11px]">
                    Endpoint quản trị viên tối mật, chặn quyền role `user` (403).
                  </p>
                </div>
              </div>

              {/* Endpoint Live Test Trigger Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF0F5] to-[#FFEBF1] border border-[#FAD6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#4A353A]">
                    Kiểm tra phân quyền tài khoản hiện tại ({user?.role?.toUpperCase()})
                  </h4>
                  <p className="text-[11px] text-[#7D676E] mt-0.5">
                    Gửi request trực tiếp đến route quản trị viên để kiểm tra tính toàn vẹn RBAC.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={isAdmin ? "admin" : "primary"}
                  isLoading={adminLoading}
                  onClick={handleTestAdminEndpoint}
                  className="shrink-0"
                  icon={<span className="material-symbols-outlined text-[16px]">bolt</span>}
                >
                  Gửi Request RBAC
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Identity Details & Quick Links */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Phiên làm việc hiện tại</CardTitle>
                <CardDescription>Thông tin định danh và quyền hạn</CardDescription>
              </div>
              <Badge variant={isAdmin ? "admin" : "user"}>
                {user?.role || "GUEST"}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div className="space-y-2.5">
                <div className="flex justify-between py-1.5 border-b border-[#FAD6DF]">
                  <span className="text-[#7D676E]">User ID:</span>
                  <span className="font-mono text-[#4A353A] font-semibold">{user?._id || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#FAD6DF]">
                  <span className="text-[#7D676E]">Họ và Tên:</span>
                  <span className="font-bold text-[#4A353A]">{user?.name || "Anonymous"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#FAD6DF]">
                  <span className="text-[#7D676E]">Email:</span>
                  <span className="font-mono text-[#4A353A] font-semibold">{user?.email || "None"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#FAD6DF]">
                  <span className="text-[#7D676E]">Quyền hạn (Role):</span>
                  <span className="font-bold text-[#D84A75] uppercase">{user?.role || "user"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#7D676E]">Khởi tạo vào:</span>
                  <span className="text-[#4A353A] font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleString("vi-VN") : "Gần đây"}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => onNavigate?.("/profile")}
                  icon={<span className="material-symbols-outlined text-[16px]">lock_reset</span>}
                >
                  Đổi mật khẩu
                </Button>
                {isAdmin && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => onNavigate?.("/users")}
                    icon={<span className="material-symbols-outlined text-[16px]">manage_accounts</span>}
                  >
                    Quản lý RBAC
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Security Audit Logs Table */}
      <Card id="logs">
        <CardHeader>
          <div>
            <CardTitle>Live Security Telemetry & Audit Trail</CardTitle>
            <CardDescription>
              Các sự kiện xác thực JWT và kiểm tra quyền RBAC theo thời gian thực
            </CardDescription>
          </div>
          <Badge variant="cluster">LIVE STREAM</Badge>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#4A353A]">
              <thead>
                <tr className="border-b border-[#FAD6DF] text-[#7D676E]">
                  <th className="pb-3 font-bold">EVENT ID</th>
                  <th className="pb-3 font-bold">ACTION / ENDPOINT</th>
                  <th className="pb-3 font-bold">PRINCIPAL</th>
                  <th className="pb-3 font-bold">ROLE</th>
                  <th className="pb-3 font-bold">CLIENT IP</th>
                  <th className="pb-3 font-bold">RESPONSE</th>
                  <th className="pb-3 font-bold text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAD6DF]/60 font-mono">
                {liveEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#FFF0F5] transition-colors">
                    <td className="py-3 text-[#D84A75] font-bold">{evt.id}</td>
                    <td className="text-[#4A353A] font-sans font-medium">{evt.action}</td>
                    <td className="text-[#7D676E]">{evt.user}</td>
                    <td>
                      <Badge variant={evt.role === "admin" ? "admin" : "user"}>
                        {evt.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="text-[#967C84]">{evt.ip}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          evt.success ? "text-[#1B7A5C]" : "text-[#C8234D]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {evt.success ? "check_circle" : "cancel"}
                        </span>
                        {evt.status}
                      </span>
                    </td>
                    <td className="text-right text-[#967C84] font-sans">{evt.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: Simulated / Live RBAC Response (Admin vs User) */}
      <Modal
        isOpen={showSimModal}
        onClose={() => setShowSimModal(false)}
        title="RBAC Authorization Inspection"
        subtitle="Kết quả kiểm tra Role-Based Access Control tại GET /api/auth/admin/dashboard"
        footer={
          <Button variant="secondary" onClick={() => setShowSimModal(false)}>
            Đóng cửa sổ
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[#7D676E]">
            Endpoint bảo vệ{" "}
            <code className="bg-[#FFF0F5] text-[#D84A75] px-1.5 py-0.5 rounded font-mono font-bold border border-[#FAD6DF]">
              GET /api/auth/admin/dashboard
            </code>{" "}
            yêu cầu JWT Bearer Token với quyền hạn <code className="text-[#1B7A5C] font-bold">role: "admin"</code>.
          </p>

          {adminTestData ? (
            <div className="p-4 rounded-2xl bg-[#E8F8F5] border border-[#B9ECE1] text-xs text-[#1B7A5C] space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <p className="font-bold text-sm">HTTP 200 OK - Quyền Admin Hợp Lệ</p>
              </div>
              <pre className="text-[12px] bg-white/80 p-3 rounded-xl border border-[#B9ECE1] font-mono text-[#0E6251] overflow-x-auto">
{JSON.stringify(adminTestData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FFEBF0] border border-[#FFCCD7] text-xs text-[#C8234D] space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">block</span>
                <p className="font-bold text-sm">HTTP 403 Forbidden - Truy cập bị từ chối</p>
              </div>
              <p className="text-[11px] text-[#7D676E]">
                Tài khoản hiện tại của bạn có quyền <span className="font-bold text-[#D84A75]">`user`</span>, do đó hệ thống chặn quyền truy cập vào bảng điều khiển quản trị.
              </p>
              <pre className="text-[12px] bg-white/80 p-3 rounded-xl border border-[#FFCCD7] font-mono text-[#C8234D] overflow-x-auto">
{JSON.stringify(
  adminError || {
    statusCode: 403,
    error: "Forbidden",
    message: "Bạn không có quyền truy cập",
  },
  null,
  2
)}
              </pre>
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL 2: OpenAPI v3.1 Specification Modal */}
      <Modal
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
        title="AuthShield API Integration Spec"
        subtitle="Danh sách các endpoints và quy chuẩn tích hợp API Auth"
        footer={
          <Button variant="primary" onClick={() => setShowJsonModal(false)}>
            Đóng Spec Viewer
          </Button>
        }
      >
        <div className="p-4 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF] font-mono text-xs text-[#4A353A] max-h-96 overflow-y-auto">
          <pre className="text-[11px] leading-relaxed">
{`{
  "openapi": "3.1.0",
  "info": {
    "title": "AuthShield Pastel API Auth",
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
    "/api/auth/google-login": {
      "post": { "summary": "Google Firebase Popup OAuth2", "body": { "idToken": "str" } }
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

      <Toast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default DashboardPage;