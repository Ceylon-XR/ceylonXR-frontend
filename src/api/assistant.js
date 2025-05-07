import API from "./index";

const AssistantAPI = {
  /**
   * Send a question to the assistant
   * @param {string} question - The user's question text
   * @returns {Promise<string>} - The assistant's response
   */
  askQuestion: async (question) => {
    try {
      const response = await API.post("/AssistantApi/question", { question });
      return response;
    } catch (error) {
      console.error("Error in assistant API:", error);
      throw error;
    }
  },
};

export default AssistantAPI;
