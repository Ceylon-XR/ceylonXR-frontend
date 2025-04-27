// This script injects runtime environment variables
window.env = window.env || {};
window.env.REACT_APP_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5103/api";
