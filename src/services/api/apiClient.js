import axios from "axios";

/**
 * Base URL cấu hình từ biến môi trường Vite hoặc fallback về localhost:3001
 * Chuẩn hóa loại bỏ dấu gạch chéo cuối nếu có
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
).replace(/\/$/, "");

export const TOKEN_KEY = "token";
export const ACCESS_TOKEN_KEY = "access_token";
export const USER_KEY = "user";

/**
 * Lấy JWT Bearer token từ localStorage
 * Hỗ trợ cả 2 key "token" và "access_token"
 */
export const getToken = () => {
  try {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      ""
    );
  } catch {
    return "";
  }
};

/**
 * Lưu JWT Bearer token vào localStorage
 */
export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch (e) {
    console.error("Failed to persist token", e);
  }
};

/**
 * Lấy thông tin user đã lưu
 */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Lưu thông tin user vào localStorage
 */
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

/**
 * Xóa toàn bộ thông tin phiên làm việc
 */
export const clearAuth = () => {
  setToken(null);
  setStoredUser(null);
};

/**
 * Axios Client Instance với Interceptor theo chuẩn Section 5 - API_DOCUMENTATION.md
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Tự động gắn Bearer Token vào Header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Chuẩn hóa dữ liệu trả về và xử lý lỗi tập trung
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Token hết hạn hoặc không hợp lệ -> xóa phiên làm việc
      if (status === 401) {
        clearAuth();
      }

      const errorPayload = {
        statusCode: status,
        statusText: error.response.statusText,
        message:
          data?.message ||
          (status === 401
            ? "Unauthorized: Token không hợp lệ hoặc đã hết hạn"
            : status === 403
              ? "Forbidden: Bạn không có quyền truy cập"
              : status === 404
                ? "Not Found: Không tìm thấy tài nguyên"
                : status === 409
                  ? "Conflict: Dữ liệu đã tồn tại"
                  : `Lỗi máy chủ (${status})`),
        error:
          data?.error ||
          (status === 403
            ? "Forbidden"
            : status === 401
              ? "Unauthorized"
              : status === 409
                ? "Conflict"
                : "ServerError"),
        ...data,
      };

      return Promise.reject(errorPayload);
    }

    // Lỗi kết nối mạng (Network Error)
    const networkError = {
      statusCode: 0,
      error: "NetworkError",
      message:
        error?.message ||
        "Không thể kết nối đến máy chủ API. Vui lòng kiểm tra lại kết nối mạng hoặc server.",
    };
    return Promise.reject(networkError);
  },
);

export default apiClient;
