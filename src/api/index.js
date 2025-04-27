// Access environment variables (works with both window.env and import.meta.env)
const API_BASE_URL =
  window.env?.REACT_APP_API_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5103/api";

// Common fetch options
const defaultOptions = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    console.log("Error response:", response);
    const errorData = await response.json().catch(() => null);
    console.log("Error response:", errorData);
    if (errorData && errorData.message) {
      throw errorData.message;
    } else if (errorData) {
      throw JSON.stringify(errorData);
    } else {
      throw `HTTP error ${response.status}`;
    }
  }
  return response.json();
};

// API object with methods for different HTTP verbs
const API = {
  get: (endpoint, options = {}) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: "GET",
      credentials: options.withCredentials ? "include" : undefined,
    }).then(handleResponse);
  },

  post: (endpoint, data) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  put: (endpoint, data) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: "PUT",
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  delete: (endpoint) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: "DELETE",
    }).then(handleResponse);
  },
};

export default API;
