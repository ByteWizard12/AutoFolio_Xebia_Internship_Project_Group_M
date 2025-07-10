// API Configuration for deployment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://autofolio-xebia-internship-project-group.onrender.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // Portfolio endpoints
  PORTFOLIO: `${API_BASE_URL}/api/portfolio`,
  PORTFOLIO_FINALIZED: `${API_BASE_URL}/api/portfolio/finalized`,
  PORTFOLIO_GENERATE: `${API_BASE_URL}/api/portfolio/generate`,
  PORTFOLIO_DOWNLOAD: `${API_BASE_URL}/api/portfolio/download`,
  PORTFOLIO_FINALIZE: `${API_BASE_URL}/api/portfolio/finalize`,
  PORTFOLIO_UPLOAD_RESUME: `${API_BASE_URL}/api/portfolio/upload-resume`,
  PORTFOLIO_GENERATE_ABOUT_ME: `${API_BASE_URL}/api/portfolio/generate-about-me`,
  
  // User endpoints
  USER_SUBSCRIPTION: `${API_BASE_URL}/api/user/me/subscription`,
  
  // Payment endpoints
  PAYMENT_CREATE_ORDER: `${API_BASE_URL}/api/payment/create-order`,
  PAYMENT_ACTIVATE_SUBSCRIPTION: `${API_BASE_URL}/api/payment/activate-subscription`,
};

export default API_BASE_URL; 