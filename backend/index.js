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

    console.log("Sending request to Gemini...");

    // UPDATED: Changed 'gemini-pro' to 'gemini-1.5-flash'
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
    
    // Check for API errors
    if (data.error) {
        console.error("Gemini API Error:", data.error);
        return res.status(500).json({ text: `AI Error: ${data.error.message}` });
    }

    // Safely get the text
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
        console.error("No result found in data:", JSON.stringify(data));
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
