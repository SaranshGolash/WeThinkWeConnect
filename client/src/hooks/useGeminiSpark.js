import { useState } from 'react';
import api from '../api/axios';

const useGeminiSpark = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isSparking, setIsSparking] = useState(false);
  const [error, setError] = useState(null);

  const triggerSpark = async (text) => {
    if (!text || text.length < 5) {
      alert("Type at least 5 characters to get a spark!");
      return;
    }

    setIsSparking(true);
    setError(null);
    setSuggestions([]);

    try {
      // Re-using the same backend endpoint
      const res = await api.post('/thoughts/spark', { content: text });
      console.log("Spark API Response:", res.data);
      if (res.data.suggestions && Array.isArray(res.data.suggestions)) {
        setSuggestions(res.data.suggestions);
      } else {
        console.warn("Unexpected response format:", res.data);
      }
    } catch (err) {
      console.error("Spark Error:", err);
      setError("AI is taking a nap. Try again.");
    } finally {
      setIsSparking(false);
    }
  };

  const clearSparks = () => setSuggestions([]);

  return { suggestions, isSparking, error, triggerSpark, clearSparks };
};

export default useGeminiSpark;