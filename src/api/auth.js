import API from "./index";

// Signup function that takes user data and makes a POST request
export const signup = async (userData) => {
  try {
    return await API.post("/AuthApi/signup", userData, {
      withCredentials: true,
    });
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
    return await API.post("/AuthApi/signin", credentials, {
      withCredentials: true,
    });
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
    return await API.post(
      "/AuthApi/google-callback",
      {
        code,
        redirectUri: `${window.location.origin}/auth/google/callback`,
      },
      { withCredentials: true }
    );
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

// Update user profile with FormData support for file uploads
export const updateProfile = async (userData) => {
  try {
    const formData = new FormData();

    // Append text fields
    if (userData.fullName) formData.append("fullName", userData.fullName);
    if (userData.email) formData.append("email", userData.email);

    // Append profile image if it exists
    if (userData.profileImage && userData.profileImage instanceof File) {
      formData.append("profileImage", userData.profileImage);
    }

    // Note: When using FormData, don't set Content-Type header manually
    // The browser will set it correctly with the boundary parameter
    const response = await API.put("/AuthApi/profile", formData, {
      withCredentials: true,
    });

    return response;
  } catch (error) {
    console.log("Profile update error:", error);
    if (error.response && error.response.data) {
      throw (
        error.response.data.message ||
        error.response.data ||
        "Profile update failed"
      );
    }
    throw error.message || "Profile update failed";
  }
};

// Logout function to call backend logout endpoint
export const logoutUser = async () => {
  try {
    const response = await API.post(
      "/AuthApi/signout",
      {},
      { withCredentials: true }
    );
    // Clear local storage regardless of response
    localStorage.removeItem("user");
    return response;
  } catch (error) {
    // Still remove user from local storage even if API call fails
    localStorage.removeItem("user");
    console.log("Logout error:", error);
    if (error.response && error.response.data) {
      throw (
        error.response.data.message || error.response.data || "Logout failed"
      );
    }
    throw error.message || "Logout failed";
  }
};
