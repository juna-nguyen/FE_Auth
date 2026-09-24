import React, { useState, useEffect, useCallback } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import { authApi } from "../../services/api/apiUser";

export function ProfileSecurityPage({ user, onUserUpdate, onLogout }) {
  const [profileUser, setProfileUser] = useState(user || null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Password change form states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [formError, setFormError] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Đồng bộ hoặc gọi API /api/auth/me để cập nhật dữ liệu mới nhất
  const fetchCurrentProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const data = await authApi.getMe();
      if (data?.user) {
        setProfileUser(data.user);
        if (onUserUpdate) onUserUpdate(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch /api/auth/me:", err);
    } finally {
      setLoadingProfile(false);
    }
  }, [onUserUpdate]);

  useEffect(() => {
    fetchCurrentProfile();
  }, [fetchCurrentProfile]);

  const displayName = profileUser?.name || "Anonymous User";
  const displayEmail = profileUser?.email || "user@example.com";
  const displayRole = profileUser?.role || "user";
  const displayId = profileUser?._id || "usr_remote_id";
  const createdAtFormatted = profileUser?.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recent";

  // Password rules validation
  const hasMinLength = newPassword.length >= 6;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  const ruleScore = [hasMinLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Xử lý đổi mật khẩu (PUT /api/auth/change-password)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!oldPassword) {
      setFormError("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setFormError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setChangePasswordLoading(true);
    try {
      const res = await authApi.changePassword({
        oldPassword,
        newPassword,
      });

      triggerToast(res?.message || "Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setFormError(err?.message || "Đổi mật khẩu không thành công. Vui lòng kiểm tra lại mật khẩu cũ.");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const [activeSessions, setActiveSessions] = useState([
    {
      id: "sess_1",
      device: "Current Browser Session",
      browser: navigator.userAgent.includes("Chrome")
        ? "Chrome • Active"
        : "Web Browser • Active",
      ip: "127.0.0.1 / localhost",
      location: "Active Connection",
      current: true,
      lastActive: "Active now",
    },
  ]);

  const handleRevokeSession = async (sessionId) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    try {
      await authApi.logout();
      triggerToast("Session token revoked và đăng xuất khỏi thiết bị.");
      if (onLogout) onLogout();
    } catch {
      triggerToast("Session token revoked.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#908fa0]">
            <span>HOME</span>
            <span>/</span>
            <span>SETTINGS</span>
            <span>/</span>
            <span className="text-[#8083ff]">PROFILE & SECURITY</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-headline text-[#dae2fd] tracking-tight">
              Welcome back, {displayName}
            </h1>
            <Badge variant={displayRole === "admin" ? "admin" : "user"}>
              {displayRole.toUpperCase()} TIER
            </Badge>
            <Badge variant="cluster" icon={<span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse inline-block" />}>
              JWT Active
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131b2e] border border-[#464554]/40 font-mono text-xs text-[#908fa0]">
          <span className="material-symbols-outlined text-[16px] text-[#8083ff]">fingerprint</span>
          <span>{displayId}</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Identity Profile Card & Session Ledger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Identity Profile Overview Card */}
          <Card>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8083ff] to-[#571bc1] p-0.5 shadow-xl">
                  <div className="w-full h-full rounded-full bg-[#131b2e] flex items-center justify-center font-bold text-xl text-[#c0c1ff]">
                    {displayName.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "US"}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#060e20] flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#4edea3]" />
                </div>
              </div>

              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-headline font-bold text-lg text-[#dae2fd]">{displayName}</h3>
                  <Badge variant={displayRole === "admin" ? "admin" : "user"}>
                    {displayRole}
                  </Badge>
                </div>
                <p className="text-xs text-[#908fa0] font-mono">{displayEmail}</p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#222a3d] text-[#c7c4d7]">
                    GET /api/auth/me
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20">
                    Created: {createdAtFormatted}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#464554]/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#908fa0]">Account Status</span>
                <span className="text-[#4edea3] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                  Active & Verified
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#908fa0]">Role Claim</span>
                <span className="font-mono text-[#c0c1ff]">{displayRole}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#908fa0]">Auth Mechanism</span>
                <span className="text-[#c7c4d7]">JWT Bearer (1-Day TTL)</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#464554]/30 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchCurrentProfile}
                disabled={loadingProfile}
                icon={<span className="material-symbols-outlined text-[16px]">sync</span>}
              >
                {loadingProfile ? "Syncing..." : "Sync Remote Profile"}
              </Button>
            </div>
          </Card>

          {/* Active Sessions Ledger */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Active Sessions Ledger</CardTitle>
                <CardDescription>Active JWT authentication tokens</CardDescription>
              </div>
              <span className="material-symbols-outlined text-[#8083ff]">devices</span>
            </CardHeader>

            <CardContent className="space-y-3">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-xl bg-[#060e20] border border-[#464554]/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#222a3d] flex items-center justify-center text-[#c0c1ff]">
                      <span className="material-symbols-outlined text-[18px]">laptop</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#dae2fd]">{session.device}</p>
                      <p className="text-[11px] text-[#908fa0]">{session.browser}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">
                      {session.lastActive}
                    </span>
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      title="Revoke session"
                      className="p-1.5 rounded-lg text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Password Change & Security Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Change Master Password Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Change Master Password</CardTitle>
                <CardDescription>
                  PUT /api/auth/change-password endpoint connection
                </CardDescription>
              </div>
              <span className="material-symbols-outlined text-[#8083ff]">lock_reset</span>
            </CardHeader>

            <CardContent>
              {formError && (
                <div className="p-3 mb-4 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/40 text-xs text-[#ffb4ab] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input
                  label="Current Password (oldPassword)"
                  type={showOldPass ? "text" : "password"}
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">lock</span>}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="hover:text-[#dae2fd] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showOldPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  }
                  required
                />

                <div className="space-y-2">
                  <Input
                    label="New Password (newPassword - min 6 characters)"
                    type={showNewPass ? "text" : "password"}
                    placeholder="Enter new strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    iconLeft={<span className="material-symbols-outlined text-[18px]">key</span>}
                    iconRight={
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="hover:text-[#dae2fd] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showNewPass ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    }
                    required
                  />

                  {/* Password Strength Checklist */}
                  {newPassword && (
                    <div className="p-3 rounded-xl bg-[#060e20] border border-[#464554]/30 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[#908fa0]">Complexity Score:</span>
                        <span
                          className={
                            ruleScore === 4
                              ? "text-[#4edea3]"
                              : ruleScore >= 2
                              ? "text-[#8083ff]"
                              : "text-[#ffb4ab]"
                          }
                        >
                          {ruleScore}/4 Requirements Met
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        <span className={hasMinLength ? "text-[#4edea3]" : "text-[#908fa0]"}>
                          {hasMinLength ? "✓" : "○"} Min 6 characters
                        </span>
                        <span className={hasUpper ? "text-[#4edea3]" : "text-[#908fa0]"}>
                          {hasUpper ? "✓" : "○"} Uppercase letter
                        </span>
                        <span className={hasLower ? "text-[#4edea3]" : "text-[#908fa0]"}>
                          {hasLower ? "✓" : "○"} Lowercase letter
                        </span>
                        <span className={hasNumber ? "text-[#4edea3]" : "text-[#908fa0]"}>
                          {hasNumber ? "✓" : "○"} Numeric character
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm New Password"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">lock_clock</span>}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="hover:text-[#dae2fd] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  }
                  required
                />

                {confirmPassword && (
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      passwordsMatch ? "text-[#4edea3]" : "text-[#ffb4ab]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {passwordsMatch ? "check_circle" : "cancel"}
                    </span>
                    {passwordsMatch ? "Passphrases match" : "Passphrases do not match"}
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={changePasswordLoading}
                    icon={<span className="material-symbols-outlined text-[18px]">sync_lock</span>}
                  >
                    {changePasswordLoading ? "Updating..." : "Update Master Password (PUT)"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-[#ffb4ab]/30 bg-[#93000a]/10">
            <CardHeader>
              <div>
                <CardTitle className="text-[#ffb4ab]">Danger Zone</CardTitle>
                <CardDescription>Irreversible administrative identity actions</CardDescription>
              </div>
              <span className="material-symbols-outlined text-[#ffb4ab]">warning</span>
            </CardHeader>

            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#c7c4d7]">
                <p className="font-semibold text-[#dae2fd]">Sign Out All Sessions</p>
                <p className="text-[11px] text-[#908fa0]">
                  Invalidate token and remove local credentials from this browser session.
                </p>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                Sign Out / Purge Token
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Signout / Purge Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Session Termination"
        subtitle="This action will clear your Bearer token and sign you out"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                setShowDeleteModal(false);
                if (onLogout) {
                  await onLogout();
                }
              }}
            >
              Sign Out (POST /api/auth/logout)
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#c7c4d7]">
            Xác nhận đăng xuất khỏi tài khoản <strong>{displayEmail}</strong>? Toàn bộ phiên làm việc trên trình duyệt này sẽ kết thúc.
          </p>
          <Input
            placeholder="Type CONFIRM"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className="font-mono text-center"
          />
        </div>
      </Modal>

      <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default ProfileSecurityPage;
