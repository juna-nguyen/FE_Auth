/**
 * Core API Client with JWT Bearer token management, request/response interceptors, and error handling.
 */

const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Normalize baseURL so it does not have a trailing slash
export const API_BASE_URL = DEFAULT_BASE_URL.replace(/\/$/, "");

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error("Failed to persist token", e);
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error("Failed to persist user", e);
  }
};

export const clearAuth = () => {
  setToken(null);
  setStoredUser(null);
};

/**
 * Universal request wrapper for backend API endpoints
 * @param {string} endpoint - e.g. "/api/auth/login" or full URL
 * @param {RequestInit} [options]
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      const errorPayload = {
        statusCode: response.status,
        statusText: response.statusText,
        message:
          data?.message ||
          (response.status === 401
            ? "Unauthorized: Token không hợp lệ hoặc đã hết hạn"
            : response.status === 403
            ? "Forbidden: Bạn không có quyền truy cập"
            : response.status === 404
            ? "Not Found: Không tìm thấy tài nguyên"
            : response.status === 409
            ? "Conflict: Dữ liệu đã tồn tại"
            : `Lỗi máy chủ (${response.status})`),
        error: data?.error || "Error",
        ...data,
      };

      if (response.status === 401) {
        clearAuth();
      }

      return Promise.reject(errorPayload);
    }

    return data;
  } catch (error) {
    if (error && error.statusCode) {
      throw error;
    }
    const networkError = {
      statusCode: 0,
      error: "NetworkError",
      message:
        error?.message ||
        "Không thể kết nối đến máy chủ API. Vui lòng kiểm tra lại kết nối mạng hoặc server.",
    };
    throw networkError;
  }
}

export * from "./apiUser";
export default apiRequest;
