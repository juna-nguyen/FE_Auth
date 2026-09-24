import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../context/useAuth";

export function AuthPage({ onLoginSuccess }) {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("signin"); // "signin" | "register"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In state
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regTerms, setRegTerms] = useState(true);

  // Loading & error/toast notifications
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Password entropy meter computation for Register UI
  const calculateStrength = (val) => {
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10 && /[0-9]/.test(val)) score++;
    if (val.length >= 12 && /[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strengthScore = calculateStrength(regPassword);

  const getStrengthLabel = () => {
    if (!regPassword) return { text: "Chưa nhập", color: "text-[#967C84]", bg: "bg-[#FAD6DF]" };
    if (strengthScore === 1) return { text: "Yếu (tối thiểu 6 ký tự)", color: "text-[#E63946]", bg: "bg-[#E63946]" };
    if (strengthScore === 2) return { text: "Trung bình (Khá an toàn)", color: "text-[#D84A75]", bg: "bg-[#FF8DA1]" };
    return { text: "Rất mạnh (Tối ưu bảo mật)", color: "text-[#1B7A5C]", bg: "bg-[#52B788]" };
  };

  const strengthInfo = getStrengthLabel();

  // Xử lý submit Đăng nhập (POST /api/auth/login)
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!signinEmail.trim() || !signinPassword) {
      setErrorMessage("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const data = await login({
        email: signinEmail.trim(),
        password: signinPassword,
      });

      triggerToast("Đăng nhập thành công! Đang chuyển hướng...", "success");
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
    } catch (err) {
      console.error("Login API Error:", err);
      setErrorMessage(err?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit Đăng ký (POST /api/auth/register)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage("Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!regTerms) {
      setErrorMessage("Vui lòng đồng ý với điều khoản dịch vụ để tiếp tục.");
      return;
    }

    setLoading(true);
    try {
      const data = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

      triggerToast(data?.message || "Đăng ký tài khoản thành công! Vui lòng đăng nhập.", "success");
      // Tự động chuyển qua tab đăng nhập và điền email vừa đăng ký
      setSigninEmail(regEmail.trim());
      setSigninPassword("");
      setActiveTab("signin");
    } catch (err) {
      console.error("Register API Error:", err);
      setErrorMessage(err?.message || "Đăng ký không thành công. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (data) => {
    triggerToast("Xác thực Google thành công!", "success");
    if (onLoginSuccess) {
      onLoginSuccess(data);
    }
  };

  const handleGoogleFailure = (errMsg) => {
    setErrorMessage(errMsg);
    triggerToast(errMsg, "error");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-[#FFFFFF] border border-[#FAD6DF] shadow-[0_16px_40px_rgba(233,114,150,0.12)] overflow-hidden relative backdrop-blur-xl">
        {/* Glow Flares - Soft Pastel */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFB6C1]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#E8A0BF]/25 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT COLUMN: Brand Hero & IAM Telemetry (Pastel Pink) */}
        <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-center relative bg-gradient-to-br from-[#FFF0F5] via-[#FFEBF1] to-[#FAD6DF]/40 border-b lg:border-b-0 lg:border-r border-[#FAD6DF]">
          <div className="space-y-6">
            {/* Top Brand Tag */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8DA1] to-[#FF69B4] flex items-center justify-center shadow-[0_4px_14px_rgba(255,105,180,0.35)]">
                <span className="material-symbols-outlined text-white text-[24px]">shield</span>
              </div>
              <div>
                <h1 className="font-headline font-bold text-xl tracking-tight text-[#4A353A]">
                  AuthShield IAM
                </h1>
                <p className="text-xs text-[#7D676E] font-medium">
                  Pastel Identity & Access Engine
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-[#4A353A] leading-tight">
                Secure Authentication with Pastel Charm.
              </h2>
              <p className="text-xs text-[#7D676E] leading-relaxed">
                Đăng nhập bảo mật với JWT Bearer Tokens, phân quyền RBAC phân cấp cao cấp và xác thực Firebase Google Identity một chạm.
              </p>
            </div>

            {/* Feature Highlights List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFFFF] border border-[#FAD6DF] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#FFEBF1] text-[#D84A75] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#4A353A]">HMAC-SHA256 Bearer Token</h4>
                  <p className="text-[11px] text-[#7D676E]">Phiên làm việc mã hóa 24h tự động duy trì</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFFFF] border border-[#FAD6DF] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#E8F8F5] text-[#1B7A5C] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#4A353A]">RBAC Role Enforcement</h4>
                  <p className="text-[11px] text-[#7D676E]">Bảo vệ endpoint nhạy cảm (User vs Admin)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFFFF] border border-[#FAD6DF] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#FFF8E6] text-[#B45309] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#4A353A]">Google Identity Federation</h4>
                  <p className="text-[11px] text-[#7D676E]">Đăng nhập Google Popup liên kết tài khoản</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Form Interface */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[#FFFFFF]">
          <div>
            {/* Tab Switcher: Sign In vs Register */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#FAD6DF]">
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setErrorMessage("");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "signin"
                      ? "bg-gradient-to-r from-[#FF8DA1] to-[#FF69B4] text-white shadow-xs"
                      : "text-[#7D676E] hover:text-[#4A353A]"
                  }`}
                >
                  Đăng nhập (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setErrorMessage("");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "register"
                      ? "bg-gradient-to-r from-[#FF8DA1] to-[#FF69B4] text-white shadow-xs"
                      : "text-[#7D676E] hover:text-[#4A353A]"
                  }`}
                >
                  Đăng ký (Register)
                </button>
              </div>

              <span className="text-xs text-[#7D676E] font-medium hidden sm:inline">
                {activeTab === "signin" ? "Xác thực tài khoản" : "Tạo tài khoản mới"}
              </span>
            </div>

            {/* Error Notification Alert Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-[#FFEBF0] border border-[#FFCCD7] text-[#C8234D] flex items-start gap-3 animate-in fade-in duration-200">
                <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
                <div className="text-xs">
                  <p className="font-bold">Lỗi xác thực</p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* FORM 1: SIGN IN */}
            {activeTab === "signin" && (
              <form onSubmit={handleSignInSubmit} className="space-y-4 animate-in fade-in duration-200">
                <Input
                  label="Địa chỉ Email"
                  hint="Required"
                  type="email"
                  placeholder="admin@authshield.io"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">mail</span>}
                  required
                />

                <Input
                  label="Mật khẩu (Password)"
                  hint="Min 6 ký tự"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">lock</span>}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer hover:text-[#4A353A] transition-colors"
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  }
                  required
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[#7D676E]">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-[#FAD6DF] text-[#FF69B4] focus:ring-[#FF8DA1]"
                    />
                    <span>Ghi nhớ phiên đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      triggerToast("Vui lòng liên hệ Admin hệ thống để khôi phục tài khoản.", "info")
                    }
                    className="text-[#D84A75] hover:underline font-semibold cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={loading}
                    className="w-full py-3"
                    icon={<span className="material-symbols-outlined text-[18px]">login</span>}
                  >
                    {loading ? "Đang xác thực & Nhận Token..." : "Authenticate & Request Bearer Token"}
                  </Button>
                </div>
              </form>
            )}

            {/* FORM 2: REGISTER */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in duration-200">
                <Input
                  label="Họ và Tên"
                  hint="Display name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">person</span>}
                  required
                />

                <Input
                  label="Email xác thực"
                  hint="Unique identity"
                  type="email"
                  placeholder="user@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">mail</span>}
                  required
                />

                <div className="space-y-1.5">
                  <Input
                    label="Mật khẩu bảo mật"
                    hint="Tối thiểu 6 ký tự"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tối thiểu 6 ký tự"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    iconLeft={<span className="material-symbols-outlined text-[18px]">lock</span>}
                    iconRight={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer hover:text-[#4A353A] transition-colors"
                        tabIndex={-1}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    }
                    required
                  />

                  {/* Password Strength Meter */}
                  {regPassword.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#7D676E]">Độ mạnh mật khẩu:</span>
                        <span className={`font-semibold ${strengthInfo.color}`}>
                          {strengthInfo.text}
                        </span>
                      </div>
                      <div className="w-full bg-[#FAF0F2] rounded-full h-1.5 overflow-hidden flex gap-1">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strengthScore >= 1 ? strengthInfo.bg : "bg-transparent"
                          }`}
                          style={{ width: "33%" }}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${
                            strengthScore >= 2 ? strengthInfo.bg : "bg-transparent"
                          }`}
                          style={{ width: "33%" }}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${
                            strengthScore >= 3 ? strengthInfo.bg : "bg-transparent"
                          }`}
                          style={{ width: "34%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Xác nhận mật khẩu"
                  hint="Match password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">verified</span>}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="cursor-pointer hover:text-[#4A353A] transition-colors"
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  }
                  required
                />

                <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-[#7D676E] pt-1">
                  <input
                    type="checkbox"
                    checked={regTerms}
                    onChange={(e) => setRegTerms(e.target.checked)}
                    className="mt-0.5 rounded border-[#FAD6DF] text-[#FF69B4] focus:ring-[#FF8DA1]"
                  />
                  <span>
                    Tôi đồng ý với chính sách bảo mật và điều khoản sử dụng AuthShield.
                  </span>
                </label>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={loading}
                    className="w-full py-3"
                    icon={<span className="material-symbols-outlined text-[18px]">person_add</span>}
                  >
                    {loading ? "Đang khởi tạo tài khoản..." : "Tạo tài khoản mới (Register)"}
                  </Button>
                </div>
              </form>
            )}

            {/* Social Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#FAD6DF]" />
              </div>
              <span className="relative bg-[#FFFFFF] px-3 text-[11px] font-bold uppercase tracking-wider text-[#967C84]">
                Hoặc tiếp tục với
              </span>
            </div>

            {/* Google Authentication Button */}
            <GoogleLoginButton
              onLoginSuccess={handleGoogleSuccess}
              onLoginFailure={handleGoogleFailure}
            />
          </div>

          {/* Bottom Switch Note */}
          <div className="mt-8 pt-4 border-t border-[#FAD6DF] text-center text-xs text-[#7D676E]">
            {activeTab === "signin" ? (
              <p>
                Chưa có tài khoản định danh?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setErrorMessage("");
                  }}
                  className="text-[#D84A75] font-bold hover:underline cursor-pointer ml-1"
                >
                  Đăng ký tài khoản mới ngay
                </button>
              </p>
            ) : (
              <p>
                Đã có tài khoản hệ thống?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setErrorMessage("");
                  }}
                  className="text-[#D84A75] font-bold hover:underline cursor-pointer ml-1"
                >
                  Quay lại Đăng nhập
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      <Toast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default AuthPage;