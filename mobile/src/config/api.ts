// API Configuration
// TODO: Update this URL based on your environment
// For iOS simulator: http://localhost:3000
// For Android emulator: http://10.0.2.2:3000
// For physical device: http://YOUR_COMPUTER_IP:3000

export const API_URL = __DEV__
    ? "http://localhost/api" // Development URL
    : "https://your-production-api.com"; // Production URL

export const ENDPOINTS = {
    SYNC_PULL: `${API_URL}/sync/pull`,
    SYNC_PUSH: `${API_URL}/sync/push`,
};
