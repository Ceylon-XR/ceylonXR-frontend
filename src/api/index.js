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

  post: (endpoint, data, options = {}) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify(data),
      credentials: options.withCredentials ? "include" : undefined,
    }).then(handleResponse);
  },

  put: (endpoint, data, options = {}) => {
    // Check if data is FormData, if so, don't set Content-Type header
    const headers = data instanceof FormData ? {} : defaultOptions.headers;

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      headers,
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
      credentials: options.withCredentials ? "include" : undefined,
    }).then(handleResponse);
  },

  delete: (endpoint, options = {}) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: "DELETE",
      credentials: options.withCredentials ? "include" : undefined,
    }).then(handleResponse);
  },
};

export default API;
