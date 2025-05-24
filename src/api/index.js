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
    // Try to get both text and JSON formats to ensure we don't miss error messages
    const responseText = await response.text();

    // Try to parse as JSON first
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch (e) {
      // If not JSON, use the raw text
      errorData = { message: responseText };
    }

    // Create a custom error object with both message and raw data
    const error = new Error(errorData.message || responseText);
    error.status = response.status;
    error.data = errorData;
    error.response = response;
    console.log("API Error:", error);

    throw error;
  }

  // For successful responses, try to parse JSON, fall back to text if not JSON
  const responseText = await response.text();
  if (!responseText) return {};

  try {
    return JSON.parse(responseText);
  } catch (e) {
    return responseText;
  }
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
