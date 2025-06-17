// API configuration
export const API_BASE_URL = 'http://127.0.0.1:8000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  // Tracking endpoints
  TRACKING: {
    GET_PACKAGE: (trackingNumber: string) => `${API_BASE_URL}/api/track/${trackingNumber}`,
  },
  // Driver endpoints
  DRIVER: {
    GET_ASSIGNMENTS: `${API_BASE_URL}/api/driver/assignments`,
    UPDATE_STATUS: (deliveryId: string) => `${API_BASE_URL}/api/deliveries/${deliveryId}/status`,
    UPDATE_PROFILE: (userId: string) => `${API_BASE_URL}/api/driver/profile/${userId}`,
    GET_DRIVERS: `${API_BASE_URL}/api/drivers`,
  },
  // Stats endpoints
  STATS: {
    GET_STATS: `${API_BASE_URL}/api/stats`,
  },
  // Deliveries endpoints
  DELIVERIES: {
    GET_ALL: `${API_BASE_URL}/api/deliveries`,
  },
};
