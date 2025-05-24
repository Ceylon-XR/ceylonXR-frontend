import API from "./index";

export const payForPlace = async (placeId, tokensRequired) => {
  try {
    const response = await API.post(
      `/Token/pay`,
      { tokens: tokensRequired, placeId: placeId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing token payment:", error);
    // Pass through the original error so we can use its message directly
    throw error;
  }
};
