// JWT token handling utilities
// Store JWT in localStorage
export const setAuthToken = token => {
  localStorage.setItem('authToken', token);
};
// Get JWT from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};
// Remove JWT from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};
// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};
// Add token to request headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? {
    Authorization: `Bearer ${token}`
  } : {};
};