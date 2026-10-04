import apiClient from "./apiClient";

/**
 * Auth API Service Collection
 * Tương ứng với tài liệu API Authentication & Authorization (API_DOCUMENTATION.md)
 */
export const authApi = {
  /**
   * 1. Đăng ký tài khoản mới
   * POST /api/auth/register
   * @param {{ name: string, email: string, password: string }} payload
   * @returns {Promise<{ message: string, user: Object }>}
   */
  register: async (payload) => {
    return apiClient.post("/api/auth/register", payload);
  },

  /**
   * 2. Đăng nhập với email và password
   * POST /api/auth/login
   * @param {{ email: string, password: string }} payload
   * @returns {Promise<{ message: string, user: Object, token: string, expiresIn: string }>}
   */
  login: async (payload) => {
    return apiClient.post("/api/auth/login", payload);
  },

  /**
   * 3. Lấy thông tin tài khoản hiện tại (Yêu cầu Bearer Token)
   * GET /api/auth/me
   * @returns {Promise<{ message: string, user: Object }>}
   */
  getMe: async () => {
    return apiClient.get("/api/auth/me");
  },

  /**
   * 4. Đổi mật khẩu tài khoản (Yêu cầu Bearer Token)
   * PUT /api/auth/change-password
   * @param {{ oldPassword: string, newPassword: string }} payload
   * @returns {Promise<{ message: string }>}
   */
  changePassword: async (payload) => {
    return apiClient.put("/api/auth/change-password", payload);
  },

  /**
   * 5. Đăng xuất tài khoản
   * POST /api/auth/logout
   * @returns {Promise<{ message: string }>}
   */
  logout: async () => {
    return apiClient.post("/api/auth/logout");
  },

  /**
   * 6. Admin Dashboard Telemetry (Yêu cầu role admin)
   * GET /api/auth/admin/dashboard
   * @returns {Promise<{ message: string }>}
   */
  getAdminDashboard: async () => {
    return apiClient.get("/api/auth/admin/dashboard");
  },

  /**
   * 7. Đăng nhập bằng Google Identity (Firebase ID Token)
   * POST /api/auth/google-login
   * @param {{ idToken: string }} payload
   * @returns {Promise<{ message: string, user: Object, token: string }>}
   */
  googleLogin: async (payload) => {
    return apiClient.post("/api/auth/google-login", payload);
  },

  /**
   * 8. Yêu cầu đặt lại mật khẩu qua email
   * POST /api/auth/forgot-password
   * @param {{ email: string }} payload
   * @returns {Promise<{ message: string }>}
   */
  forgotPassword: async (payload) => {
    return apiClient.post("/api/auth/forgot-password", payload);
  },

  /**
   * 9. Đặt lại mật khẩu mới bằng token
   * POST /api/auth/reset-password
   * @param {{ token: string, newPassword: string }} payload
   * @returns {Promise<{ message: string }>}
   */
  resetPassword: async (payload) => {
    return apiClient.post("/api/auth/reset-password", payload);
  },
};

export default authApi;