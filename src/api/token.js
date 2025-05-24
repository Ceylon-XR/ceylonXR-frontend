import API from "./index";

export const payForPlace = async (placeId, tokensRequired) => {
  try {
    const response = await API.post(
      `/tokens/pay/${placeId}`,
      { tokens: tokensRequired, placeId: placeId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing token payment:", error);
    throw error;
  }
};
