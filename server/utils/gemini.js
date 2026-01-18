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

  ggenerateSparks: async (content) => {
    try {
      const prompt = `
        The user is writing a poetic, unfinished thought: "${content}".
        
        Generate 3 different short continuations (max 10 words each) that complete the current sentence but leave the thought OPEN-ENDED.
        
        1. Melancholic/Sad style.
        2. Hopeful/Light style.
        3. Abstract/Dark style.
        
        Return ONLY the 3 phrases separated by a pipe symbol "|". 
        Example output: and the rain never stopped|but the sun might rise tomorrow|into the void of silence
        Do not include numbering or labels.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Split by pipe to get array
      const suggestions = text.split('|').map(s => s.trim());
      return suggestions;

    } catch (error) {
      console.error("Gemini Spark Error:", error);
      return []; 
    }
  },

  analyzeSentiment: async (content) => {
    try {
      const prompt = `
        Analyze the sentiment and emotional tone of this unfinished thought: "${content}".
        
        Return ONLY a single word from this list: 
        [Melancholic, Hopeful, Cynical, Curious, Neutral, Abstract, Whimsical, Dark, Romantic].
        
        If it doesn't fit well, default to "Neutral". Do not write any other text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let mood = response.text().trim();

      // Cleanup: Removes any accidental extra chars
      mood = mood.replace(/[^a-zA-Z]/g, ""); 
      
      return mood || "Neutral";
    } catch (error) {
      console.error("Gemini Sentiment Error:", error);
      return "Neutral";
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