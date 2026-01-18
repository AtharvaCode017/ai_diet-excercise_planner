import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
  res.send("AI Diet Backend is running 🚀");
});

// CHANGED: Route is now '/generate' to match frontend
app.post("/generate", async (req, res) => {
  try {
    // CHANGED: We now accept the 'prompt' directly from the frontend
    const { prompt } = req.body; 

    if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body; 

    if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    console.log("Sending request to Gemini..."); // Log 1

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    // DEBUG: Print the actual response from Google to the Render logs
    console.log("Gemini Response:", JSON.stringify(data, null, 2));

    if (data.error) {
        return res.status(500).json({ text: `AI Error: ${data.error.message}` });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
        return res.json({ text: "The AI sent an empty response. Check logs." });
    }

    res.json({ text: result }); 
  } catch (error) {
    console.error("Server Crash:", error);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

    // CHANGED: The frontend expects a JSON object with a 'text' property
    res.json({ text: result }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
