/**
 * Core API Client & Services Layer
 * Tuân thủ quy chuẩn tích hợp theo API_DOCUMENTATION.md (Axios + Interceptors)
 */

export * from "./apiClient";
export * from "./apiUser";

import apiClient from "./apiClient";
import authApi from "./apiUser";

/**
 * Request wrapper hỗ trợ tương thích ngược cho các module cũ nếu cần
 * @param {string} endpoint
 * @param {RequestInit} [options]
 */
export async function apiRequest(endpoint, options = {}) {
  const method = (options.method || "GET").toLowerCase();
  let data = undefined;

  if (options.body) {
    try {
      data = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
    } catch {
      data = options.body;
    }
  }

  return apiClient.request({
    url: endpoint,
    method,
    data,
    headers: options.headers,
  });
}

export { authApi };
export default apiClient;