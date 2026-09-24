import { apiRequest } from "./index";

/**
 * Auth API service collection
 */
export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register
   * @param {{ name: string, email: string, password: string }} payload
   */
  register: async (payload) => {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Login with email and password
   * POST /api/auth/login
   * @param {{ email: string, password: string }} payload
   */
  login: async (payload) => {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Google Login using Firebase idToken
   * POST /api/auth/google-login
   * @param {{ idToken: string }} payload
   */
  googleLogin: async (payload) => {
    return apiRequest("/api/auth/google-login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get current authenticated user details
   * GET /api/auth/me
   */
  getMe: async () => {
    return apiRequest("/api/auth/me", {
      method: "GET",
    });
  },

  /**
   * Change password for authenticated user
   * PUT /api/auth/change-password
   * @param {{ oldPassword: string, newPassword: string }} payload
   */
  changePassword: async (payload) => {
    return apiRequest("/api/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Notify server of user logout
   * POST /api/auth/logout
   */
  logout: async () => {
    return apiRequest("/api/auth/logout", {
      method: "POST",
    });
  },

  /**
   * Retrieve Admin Dashboard telemetry (Requires admin role)
   * GET /api/auth/admin/dashboard
   */
  getAdminDashboard: async () => {
    return apiRequest("/api/auth/admin/dashboard", {
      method: "GET",
    });
  },
};

export default authApi;