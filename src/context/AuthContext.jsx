import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authContextInstance";
import { authApi } from "../services/api/apiUser";
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearAuth,
} from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setTokenState] = useState(() => getToken());
  const [isInitializing, setIsInitializing] = useState(true);

  // Tự động kiểm tra token & tải thông tin người dùng từ /api/auth/me
  const refreshMe = useCallback(async () => {
    const currentToken = getToken();
    if (!currentToken) {
      setUser(null);
      setTokenState("");
      return null;
    }

    try {
      const data = await authApi.getMe();
      if (data?.user) {
        setUser(data.user);
        setStoredUser(data.user);
        return data.user;
      }
      return null;
    } catch (err) {
      console.warn("Session validation failed:", err);
      clearAuth();
      setUser(null);
      setTokenState("");
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        setTokenState(storedToken);
        await refreshMe();
      } else {
        clearAuth();
        setUser(null);
        setTokenState("");
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [refreshMe]);

  // Đăng nhập email & mật khẩu
  const login = async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    if (data?.token) {
      setToken(data.token);
      setTokenState(data.token);
    }
    if (data?.user) {
      setStoredUser(data.user);
      setUser(data.user);
    }
    return data;
  };

  // Đăng ký tài khoản mới
  const register = async ({ name, email, password }) => {
    return await authApi.register({ name, email, password });
  };

  // Đăng nhập bằng Google Identity
  const googleLogin = async (idToken) => {
    const data = await authApi.googleLogin({ idToken });
    if (data?.token) {
      setToken(data.token);
      setTokenState(data.token);
    }
    if (data?.user) {
      setStoredUser(data.user);
      setUser(data.user);
    }
    return data;
  };

  // Đổi mật khẩu
  const changePassword = async ({ oldPassword, newPassword }) => {
    return await authApi.changePassword({ oldPassword, newPassword });
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn("Logout request completed with notice:", e);
    } finally {
      clearAuth();
      setUser(null);
      setTokenState("");
    }
  };

  // Cập nhật state người dùng cục bộ
  const updateUser = (updatedUser) => {
    if (updatedUser) {
      setStoredUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const isAuthenticated = Boolean(token && user);

  const value = {
    user,
    token,
    isAuthenticated,
    isInitializing,
    login,
    register,
    googleLogin,
    logout,
    changePassword,
    refreshMe,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;