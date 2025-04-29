import API from "./index";

// Get all available plans
export const getPlans = async () => {
  try {
    return await API.get("/paymentApi/plans", { withCredentials: true });
  } catch (error) {
    console.log("Get plans error:", error);
    if (error.response && error.response.data) {
      throw (
        error.response.data.message ||
        error.response.data ||
        "Failed to get plans"
      );
    }
    throw error.message || "Failed to get plans";
  }
};

// Create a checkout session
export const createCheckoutSession = async (data) => {
  try {
    return await API.post("/paymentApi/create-checkout-session", data, {
      withCredentials: true,
    });
  } catch (error) {
    console.log("Create checkout session error:", error);
    if (error.response && error.response.data) {
      throw (
        error.response.data.message ||
        error.response.data ||
        "Failed to create checkout session"
      );
    }
    throw error.message || "Failed to create checkout session";
  }
};

// Confirm the payment after successful checkout
export const confirmPayment = async (sessionId, userId, planId) => {
  try {
    return await API.get(
      `/paymentApi/payment-success?session_id=${sessionId}&user_id=${userId}&plan_id=${planId}`,
      { withCredentials: true }
    );
  } catch (error) {
    console.log("Confirm payment error:", error);
    if (error.response && error.response.data) {
      throw (
        error.response.data.message ||
        error.response.data ||
        "Failed to confirm payment"
      );
    }
    throw error.message || "Failed to confirm payment";
  }
};
