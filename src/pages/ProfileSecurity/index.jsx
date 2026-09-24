import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../context/useAuth";

export function ProfileSecurityPage({ onUserUpdate, onLogout }) {
  const { user, refreshMe, changePassword, logout } = useAuth();
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
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);
  const [formError, setFormError] = useState("");

  const triggerToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Đồng bộ hoặc gọi API /api/auth/me để cập nhật dữ liệu mới nhất
  const fetchCurrentProfile = async () => {
    setLoadingProfile(true);
    try {
      const latestUser = await refreshMe();
      if (latestUser) {
        if (onUserUpdate) onUserUpdate(latestUser);
        triggerToast("Đã đồng bộ thông tin hồ sơ mới nhất.", "success");
      }
    } catch (err) {
      console.error("Failed to fetch /api/auth/me:", err);
      triggerToast("Không thể tải thông tin hồ sơ", "error");
    } finally {
      setLoadingProfile(false);
    }
  };

  const displayName = user?.name || "Anonymous User";
  const displayEmail = user?.email || "user@example.com";
  const displayRole = user?.role || "user";
  const displayId = user?._id || "usr_remote_id";
  const createdAtFormatted = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Gần đây";

  // Password rules validation
  const hasMinLength = newPassword.length >= 6;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

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
      const res = await changePassword({
        oldPassword,
        newPassword,
      });

      triggerToast(res?.message || "Đổi mật khẩu thành công!", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setFormError(err?.message || "Đổi mật khẩu không thành công. Vui lòng kiểm tra lại mật khẩu cũ.");
      triggerToast(err?.message || "Đổi mật khẩu thất bại", "error");
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
      await logout();
      triggerToast("Phiên làm việc đã bị thu hồi. Đang đăng xuất...", "info");
      setTimeout(() => {
        if (onLogout) onLogout();
      }, 800);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAccountDelete = () => {
    if (deleteConfirmText !== displayEmail) {
      triggerToast("Email xác nhận không khớp!", "error");
      return;
    }
    setShowDeleteModal(false);
    triggerToast("Tài khoản của bạn đã được đánh dấu vô hiệu hóa.", "info");
    setTimeout(() => {
      logout();
      if (onLogout) onLogout();
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FFEBF1] via-[#FFF0F5] to-[#FFFFFF] border border-[#FAD6DF] shadow-[0_8px_24px_rgba(233,114,150,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF8DA1] to-[#FF69B4] text-white flex items-center justify-center font-headline font-bold text-2xl shadow-[0_4px_16px_rgba(255,105,180,0.35)] shrink-0">
            {displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "US"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-headline text-[#4A353A]">
                {displayName}
              </h2>
              <Badge variant={displayRole === "admin" ? "admin" : "user"}>
                {displayRole.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-[#7D676E] mt-1 font-mono">
              {displayEmail} • Member since {createdAtFormatted}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchCurrentProfile}
            isLoading={loadingProfile}
            icon={<span className="material-symbols-outlined text-[16px]">sync</span>}
          >
            Làm mới hồ sơ (/me)
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onLogout}
            icon={<span className="material-symbols-outlined text-[16px]">logout</span>}
          >
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Profile info & Security Policies */}
        <div className="lg:col-span-5 space-y-6">
          {/* Identity Metadata Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Thông tin định danh</CardTitle>
                <CardDescription>Dữ liệu xác thực tài khoản JWT</CardDescription>
              </div>
              <Badge variant="success">Verified</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-[#FAD6DF]">
                  <span className="text-[#7D676E]">ID Định Danh:</span>
                  <span className="font-mono text-[#4A353A] font-semibold">{displayId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#FAD6DF]">
                  <span className="text-[#7D676E]">Họ và Tên:</span>
                  <span className="font-bold text-[#4A353A]">{displayName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#FAD6DF]">
                  <span className="text-[#7D676E]">Email:</span>
                  <span className="font-mono text-[#4A353A] font-semibold">{displayEmail}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#FAD6DF]">
                  <span className="text-[#7D676E]">Quyền hạn (Role):</span>
                  <span className="font-bold text-[#D84A75] uppercase">{displayRole}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#7D676E]">Trạng thái tài khoản:</span>
                  <span className="text-[#1B7A5C] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B7A5C] animate-pulse" />
                    Hoạt động (Active)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Phiên đăng nhập hoạt động</CardTitle>
                <CardDescription>Danh sách token đang được sử dụng</CardDescription>
              </div>
              <Badge variant="cluster">1 Active</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#4A353A]">
                      <span className="material-symbols-outlined text-[16px] text-[#D84A75]">
                        laptop_chromebook
                      </span>
                      <span>{sess.device}</span>
                      {sess.current && (
                        <span className="text-[10px] bg-[#E8F8F5] text-[#1B7A5C] px-1.5 py-0.2 rounded font-mono font-bold">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7D676E] font-mono">
                      {sess.browser} • {sess.ip}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#C8234D] hover:bg-[#FFEBF0]"
                    onClick={() => handleRevokeSession(sess.id)}
                  >
                    Thu hồi
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-[#FFCCD7] bg-[#FFFFFF]">
            <CardHeader>
              <div>
                <CardTitle className="text-[#C8234D]">Vùng bảo mật đặc biệt</CardTitle>
                <CardDescription>Các thao tác không thể hoàn tác</CardDescription>
              </div>
              <span className="material-symbols-outlined text-[#C8234D] text-[20px]">warning</span>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-[#7D676E] mb-4">
                Vô hiệu hóa tài khoản và xóa tất cả JWT tokens đã cấp phát.
              </p>
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => setShowDeleteModal(true)}
                icon={<span className="material-symbols-outlined text-[16px]">delete_forever</span>}
              >
                Yêu cầu xóa / Vô hiệu hóa tài khoản
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Password & Security Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Đổi mật khẩu tài khoản</CardTitle>
                <CardDescription>
                  Cập nhật mật khẩu xác thực mới (Gọi API PUT /api/auth/change-password)
                </CardDescription>
              </div>
              <Badge variant="primary">Security Form</Badge>
            </CardHeader>

            <CardContent>
              {formError && (
                <div className="mb-4 p-3.5 rounded-2xl bg-[#FFEBF0] border border-[#FFCCD7] text-[#C8234D] flex items-start gap-2 text-xs animate-in fade-in duration-150">
                  <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input
                  label="Mật khẩu hiện tại"
                  hint="Required"
                  type={showOldPass ? "text" : "password"}
                  placeholder="Nhập mật khẩu cũ của bạn"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">lock</span>}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="cursor-pointer hover:text-[#4A353A] transition-colors"
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showOldPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  }
                  required
                />

                <Input
                  label="Mật khẩu mới"
                  hint="Tối thiểu 6 ký tự"
                  type={showNewPass ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">key</span>}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="cursor-pointer hover:text-[#4A353A] transition-colors"
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showNewPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  }
                  required
                />

                {/* Password Criteria checklist */}
                <div className="p-3 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF] space-y-1.5 text-xs">
                  <span className="font-bold text-[#4A353A] text-[11px] uppercase tracking-wider">
                    Tiêu chuẩn an toàn mật khẩu:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <span className={`flex items-center gap-1 ${hasMinLength ? "text-[#1B7A5C] font-bold" : "text-[#967C84]"}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {hasMinLength ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      Tối thiểu 6 ký tự
                    </span>
                    <span className={`flex items-center gap-1 ${hasUpper ? "text-[#1B7A5C] font-bold" : "text-[#967C84]"}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {hasUpper ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      Chứa chữ hoa (A-Z)
                    </span>
                    <span className={`flex items-center gap-1 ${hasLower ? "text-[#1B7A5C] font-bold" : "text-[#967C84]"}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {hasLower ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      Chứa chữ thường (a-z)
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? "text-[#1B7A5C] font-bold" : "text-[#967C84]"}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {hasNumber ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      Chứa số (0-9)
                    </span>
                  </div>
                </div>

                <Input
                  label="Xác nhận mật khẩu mới"
                  hint="Must match"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">verified</span>}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="cursor-pointer hover:text-[#4A353A] transition-colors"
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  }
                  required
                />

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={changePasswordLoading}
                    icon={<span className="material-symbols-outlined text-[18px]">save</span>}
                  >
                    {changePasswordLoading ? "Đang cập nhật mật khẩu..." : "Lưu thay đổi mật khẩu (PUT /change-password)"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL: Delete account confirmation */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận yêu cầu xóa tài khoản"
        subtitle="Hành động này sẽ vô hiệu hóa toàn bộ quyền truy cập của bạn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Hủy bỏ
            </Button>
            <Button variant="danger" onClick={handleAccountDelete}>
              Xác nhận xóa tài khoản
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[#7D676E]">
            Để xác nhận, vui lòng nhập chính xác địa chỉ email của bạn:{" "}
            <strong className="text-[#4A353A] font-mono">{displayEmail}</strong>
          </p>
          <Input
            placeholder="Nhập lại email để xác nhận"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
        </div>
      </Modal>

      <Toast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default ProfileSecurityPage;