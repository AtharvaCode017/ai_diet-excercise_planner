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

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body; 

    if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    console.log("Sending request to Gemini (Model: gemini-1.5-flash)...");

    // FIXED: Using 'gemini-1.5-flash' which is the current stable model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    // Detailed Error Logging
    if (data.error) {
        console.error("Gemini API Error Details:", JSON.stringify(data.error, null, 2));
        return res.status(500).json({ text: `AI Error: ${data.error.message}` });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
        console.error("Empty Result. Full Data Received:", JSON.stringify(data, null, 2));
        return res.json({ text: "Unable to generate plan. (AI returned empty response)" });
    }

    res.json({ text: result }); 

  } catch (error) {
    console.error("Server Crash:", error);
    res.status(500).json({ error: "Server internal error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
