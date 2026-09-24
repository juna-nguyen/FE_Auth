import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { authApi } from "../services/api/apiUser";
import { setToken, setStoredUser } from "../services/api";

export default function GoogleLoginButton({ onLoginSuccess, onLoginFailure }) {
  const [loading, setLoading] = useState(false);

  const handleLoginGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const data = await authApi.googleLogin({ idToken });

      if (data?.token) {
        setToken(data.token);
      }
      if (data?.user) {
        setStoredUser(data.user);
      }

      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      let errorMsg = error?.message || "Google authentication failed";
      if (error?.code === "auth/popup-closed-by-user") {
        errorMsg = "Cửa sổ đăng nhập Google đã bị đóng.";
      } else if (error?.code === "auth/unauthorized-domain") {
        errorMsg = "Tên miền hiện tại chưa được cấp phép trong Firebase Auth.";
      } else if (error?.code?.startsWith("auth/")) {
        errorMsg = `Firebase Auth: ${error.message}`;
      }
      if (onLoginFailure) {
        onLoginFailure(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLoginGoogle}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2.5 px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#FFF0F5] text-[#4A353A] border border-[#FAD6DF] hover:border-[#FFB6C1] rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xs active:scale-[0.98] w-full"
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-[#FF69B4]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      )}
      <span>{loading ? "Đang kết nối Google..." : "Tiếp tục với Google Identity"}</span>
    </button>
  );
}