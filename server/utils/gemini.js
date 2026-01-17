const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

const Gemini = {
  // UNFINISHED: Checks if a sentence is "open-ended"
  checkIncompleteness: async (text) => {
    // Basic fallback if API Key is missing to prevent crashes
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY missing. Skipping AI check.");
        return true; 
    }

    const prompt = `
      Analyze the following text. Determine if it represents a "complete, closed conclusion" or an "unfinished, open-ended thought/question".
      
      Text: "${text}"
      
      Rules:
      - "The sky is blue." -> COMPLETE
      - "I hate react." -> COMPLETE
      - "I wonder if the sky is actually..." -> INCOMPLETE
      - "Something about React feels off, but I can't put my finger on..." -> INCOMPLETE
      
      Return ONLY the word "COMPLETE" or "INCOMPLETE".
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text().trim().toUpperCase();
      
      // If incomplete, return true. If complete, return false.
      return textResponse === "INCOMPLETE";
    } catch (err) {
      console.error("Gemini Error:", err);
      return true; // Fallback: allow if AI fails
    }
  },

  // ECHOSWAP: Validates perspective taking
  validatePerspective: async (originalBelief, attemptedRewrite) => {
    if (!process.env.GEMINI_API_KEY) return { pass: true };

    const prompt = `
      User A believes: "${originalBelief}"
      User B attempted to rewrite this: "${attemptedRewrite}"
      Did User B accurately represent User A's belief WITHOUT refuting it?
      Return JSON: { "pass": boolean, "feedback": "string" }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      // Clean up markdown if Gemini adds it
      const cleanText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (err) {
      return { pass: false, feedback: "AI Error. Try again." };
    }
  }
};

module.exports = Gemini;