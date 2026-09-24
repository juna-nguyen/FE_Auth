import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import Toast from "../../components/ui/Toast";
import { authApi } from "../../services/api/apiUser";

export function AuthPage({ onLoginSuccess }) {
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
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
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
    if (!regPassword) return { text: "Empty", color: "text-[#908fa0]" };
    if (strengthScore === 1) return { text: "Weak (min 6 chars)", color: "text-[#ffb4ab]" };
    if (strengthScore === 2) return { text: "Medium Security", color: "text-[#8083ff]" };
    return { text: "High Entropy (Optimal)", color: "text-[#4edea3]" };
  };

  const strengthInfo = getStrengthLabel();

  // X? lÃ½ submit Ãang nh?p (POST /api/auth/login)
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!signinEmail.trim() || !signinPassword) {
      setErrorMessage("Vui lÃ²ng nh?p d?y d? Email vÃ  Password.");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.login({
        email: signinEmail.trim(),
        password: signinPassword,
      });

      triggerToast("Ãang nh?p thÃ nh cÃ´ng! Ãang chuy?n hu?ng...");
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
    } catch (err) {
      console.error("Login API Error:", err);
      setErrorMessage(err?.message || "Ãang nh?p th?t b?i. Vui lÃ²ng th? l?i.");
    } finally {
      setLoading(false);
    }
  };

  // X? lÃ½ submit Ãang kÃ½ (POST /api/auth/register)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage("Vui lÃ²ng di?n d?y d? H? tÃªn, Email vÃ  M?t kh?u.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("M?t kh?u ph?i cÃ³ Ã­t nh?t 6 kÃ½ t?.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("M?t kh?u xÃ¡c nh?n khÃ´ng kh?p.");
      return;
    }

    if (!regTerms) {
      setErrorMessage("Vui lÃ²ng d?ng Ã½ v?i di?u kho?n d?ch v? d? ti?p t?c.");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

      triggerToast(data?.message || "Ãang kÃ½ thÃ nh cÃ´ng! Vui lÃ²ng dang nh?p.");
      // T? d?ng chuy?n qua tab dang nh?p vÃ  di?n email v?a dang kÃ½
      setSigninEmail(regEmail.trim());
      setSigninPassword("");
      setActiveTab("signin");
    } catch (err) {
      console.error("Register API Error:", err);
      setErrorMessage(err?.message || "Ãang kÃ½ khÃ´ng thÃ nh cÃ´ng. Vui lÃ²ng th? l?i.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-[#131b2e]/90 border border-[#464554]/40 shadow-2xl overflow-hidden relative backdrop-blur-xl">
        {/* Glow Flares */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#8083ff]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#571bc1]/20 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT SIDE: Brand & System Features */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#171f33]/70 border-b lg:border-b-0 lg:border-r border-[#464554]/40 relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            {/* Header Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#571bc1] flex items-center justify-center shadow-lg shadow-[#8083ff]/20">
                <span className="material-symbols-outlined text-[#ffffff] text-[24px]">shield</span>
              </div>
              <div>
                <h1 className="font-headline font-bold text-lg text-[#dae2fd]">AuthShield</h1>
                <p className="text-xs font-mono text-[#908fa0]">Zero Trust Identity Engine</p>
              </div>
            </div>

            {/* IAM Engine Active Banner */}
            <div className="relative rounded-xl overflow-hidden border border-[#464554]/40 bg-[#060e20]/60 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/30">
                  IAM Engine Active
                </span>
                <span className="text-[11px] font-mono text-[#4edea3] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                  99.99% Uptime
                </span>
              </div>
              <p className="text-xs text-[#c7c4d7]">
                Dual-key ed25519 cryptographic token rotation with instant JWT revocation.
              </p>
            </div>

            {/* Headline & Value Pitch */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-headline text-[#dae2fd] leading-snug">
                Enterprise Identity & Access Security
              </h2>
              <p className="text-xs text-[#c7c4d7]">
                Engineered for sovereign control, high-throughput session authentication, and granular RBAC.
              </p>
            </div>

            {/* Feature Matrix */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#222a3d]/50 border border-[#464554]/20">
                <span className="material-symbols-outlined text-[#4edea3] text-[20px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-[#dae2fd]">RBAC Multi-Tier Enforcement</h4>
                  <p className="text-[11px] text-[#908fa0]">Granular administrative role & permission mapping.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#222a3d]/50 border border-[#464554]/20">
                <span className="material-symbols-outlined text-[#8083ff] text-[20px] shrink-0 mt-0.5">
                  key
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-[#dae2fd]">JWT Bearer Token Architecture</h4>
                  <p className="text-[11px] text-[#908fa0]">1-day cryptographically signed authentication payload.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="pt-6 border-t border-[#464554]/30 flex items-center justify-between text-xs font-mono text-[#908fa0] relative z-10">
            <span>TLS 1.3 / mTLS Enforced</span>
            <span className="text-[#8083ff]">SHA-256 Validated</span>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Auth Forms */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Tab Switcher */}
            <div className="flex bg-[#060e20] p-1 rounded-xl border border-[#464554]/40">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signin");
                  setErrorMessage("");
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-headline text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "signin"
                    ? "bg-[#222a3d] text-[#dae2fd] shadow-md border border-[#464554]/40"
                    : "text-[#908fa0] hover:text-[#dae2fd]"
                }`}
              >
                Sign In (JWT Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setErrorMessage("");
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-headline text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "register"
                    ? "bg-[#222a3d] text-[#dae2fd] shadow-md border border-[#464554]/40"
                    : "text-[#908fa0] hover:text-[#dae2fd]"
                }`}
              >
                Register Identity
              </button>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/40 text-xs text-[#ffb4ab] flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google OAuth Quick SSO Button */}
            <div className="space-y-2">
              <GoogleLoginButton
                onLoginSuccess={(data) => {
                  triggerToast("Google SSO Login Successful!");
                  if (onLoginSuccess) onLoginSuccess(data);
                }}
                onLoginFailure={(msg) => setErrorMessage(msg)}
              />
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#464554]/40" />
                <span className="flex-shrink mx-3 text-[11px] font-mono text-[#908fa0] uppercase tracking-wider">
                  Or continue with credentials
                </span>
                <div className="flex-grow border-t border-[#464554]/40" />
              </div>
            </div>

            {/* TAB 1: SIGN IN FORM */}
            {activeTab === "signin" && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <Input
                  label="Email Identifier"
                  type="email"
                  placeholder="user@example.com"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">alternate_email</span>}
                  required
                />

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#c7c4d7]">Master Passphrase</label>
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    iconLeft={<span className="material-symbols-outlined text-[18px]">lock</span>}
                    iconRight={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-[#dae2fd] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    }
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#908fa0]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-[#464554] bg-[#060e20] text-[#8083ff] focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Persist session token</span>
                  </label>
                  <span className="text-[#8083ff] hover:underline cursor-pointer">
                    Forgot passphrase?
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 mt-2"
                  disabled={loading}
                  icon={<span className="material-symbols-outlined text-[18px]">lock_open</span>}
                >
                  {loading ? "Verifying Credentials..." : "Authenticate & Request Bearer Token"}
                </Button>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <Input
                  label="Full Name / Display Principal"
                  type="text"
                  placeholder="Nguyen Van A"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">person</span>}
                  required
                />

                <Input
                  label="Corporate Email"
                  type="email"
                  placeholder="user@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">alternate_email</span>}
                  required
                />

                <div className="space-y-1.5">
                  <Input
                    label="Master Password (min 6 characters)"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create secure passphrase"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    iconLeft={<span className="material-symbols-outlined text-[18px]">lock</span>}
                    iconRight={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-[#dae2fd] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    }
                    required
                  />

                  {/* Interactive Entropy Meter */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#908fa0]">Entropy Strength:</span>
                      <span className={strengthInfo.color}>{strengthInfo.text}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 h-1">
                      <div
                        className={`rounded-full transition-colors ${
                          regPassword.length > 0
                            ? strengthScore >= 1
                              ? strengthScore === 1
                                ? "bg-[#ffb4ab]"
                                : strengthScore === 2
                                ? "bg-[#8083ff]"
                                : "bg-[#4edea3]"
                              : "bg-[#ffb4ab]"
                            : "bg-[#2d3449]"
                        }`}
                      />
                      <div
                        className={`rounded-full transition-colors ${
                          strengthScore >= 2
                            ? strengthScore === 2
                              ? "bg-[#8083ff]"
                              : "bg-[#4edea3]"
                            : "bg-[#2d3449]"
                        }`}
                      />
                      <div
                        className={`rounded-full transition-colors ${
                          strengthScore >= 3 ? "bg-[#4edea3]" : "bg-[#2d3449]"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat master password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  iconLeft={<span className="material-symbols-outlined text-[18px]">lock_clock</span>}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="hover:text-[#dae2fd] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  }
                  required
                />

                <label className="flex items-center gap-2 text-xs text-[#c7c4d7] cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={regTerms}
                    onChange={(e) => setRegTerms(e.target.checked)}
                    className="rounded border-[#464554] bg-[#060e20] text-[#8083ff] focus:ring-0 focus:ring-offset-0"
                  />
                  <span>
                    I agree to the <span className="text-[#8083ff]">Zero Trust Access Policy</span> and Encryption
                    Terms.
                  </span>
                </label>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 mt-2"
                  disabled={loading}
                  icon={<span className="material-symbols-outlined text-[18px]">how_to_reg</span>}
                >
                  {loading ? "Registering Identity..." : "Provision Account (POST /api/auth/register)"}
                </Button>
              </form>
            )}
          </div>

          {/* Technical API Route Note Banner (Pinned to Bottom) */}
          <div className="mt-6 pt-3 flex items-center justify-between text-xs font-mono bg-[#060e20] p-3 rounded-xl border border-[#464554]/40 text-[#908fa0]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#4edea3]">api</span>
              <span>{activeTab === "signin" ? "POST /api/auth/login" : "POST /api/auth/register"}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#222a3d] text-[#dae2fd] font-semibold text-[11px]">
              200 OK / 201 CREATED
            </span>
          </div>
        </div>
      </div>

      <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default AuthPage;
