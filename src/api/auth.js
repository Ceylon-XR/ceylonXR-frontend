import API from "./index";

// Signup function that takes user data and makes a POST request
export const signup = async (userData) => {
  try {
    return await API.post("/AuthApi/signup", userData);
  } catch (error) {
    // Check if we have a response with error details from the server
    if (error.response && error.response.data) {
      throw (
        error.response.data.message || error.response.data || "Signup failed"
      );
    }
    throw error.message || "Signup failed";
  }
};

// Login function that accepts either username or email
export const login = async (credentials) => {
  try {
    return await API.post("/AuthApi/signin", credentials);
  } catch (error) {
    console.log("Login error:", error);
    // Check if we have a response with error details from the server
    if (error.response && error.response.data) {
      throw (
        error.response.data.message || error.response.data || "Login failed"
      );
    }
    throw error.message || "Login failed";
  }
};

// Get current user authentication status
export const getCurrentUser = async () => {
  try {
    return await API.get("/AuthApi/me", { withCredentials: true });
  } catch (error) {
    console.log("Authentication check error:", error);
    // Check if we have a response with error details from the server
    if (error.response && error.response.data) {
      throw (
        error.response.data.message ||
        error.response.data ||
        "Authentication check failed"
      );
    }
    throw error.message || "Authentication check failed";
  }
};

// Handle Google OAuth callback
export const handleGoogleCallback = async (code) => {
  try {
    return await API.post("/AuthApi/google-callback", {
      code,
      redirectUri: `${window.location.origin}/auth/google/callback`,
    });
  } catch (error) {
    console.log("Google authentication error:", error);
    // Check if we have a response with error details from the server
    if (error.response && error.response.data) {
      throw (
        error.response.data.message ||
        error.response.data ||
        "Google authentication failed"
      );
    }
    throw error.message || "Google authentication failed";
  }
};

// Logout function for future use
export const logout = () => {
  localStorage.removeItem("user");
};
