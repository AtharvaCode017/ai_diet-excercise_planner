import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// DIAGNOSTIC FUNCTION: This runs when the server starts
async function listAvailableModels() {
  try {
    console.log("🔍 Checking available Gemini models for your API Key...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const data = await response.json();
    
    if (data.models) {
      console.log("✅ AVAILABLE MODELS:");
      data.models.forEach(m => console.log(`   - ${m.name.replace('models/', '')}`));
    } else {
      console.log("❌ Could not list models. Error:", JSON.stringify(data));
    }
  } catch (error) {
    console.error("❌ Failed to check models:", error.message);
  }
}

app.get("/", (req, res) => {
  res.send("AI Diet Backend is running 🚀");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body; 

    if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    // TRYING THE LATEST MODEL: gemini-2.0-flash-exp
    const modelName = "gemini-2.0-flash-exp"; 
    console.log(`Sending request to Gemini (Model: ${modelName})...`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
        console.error("Gemini API Error:", JSON.stringify(data.error, null, 2));
        // If 2.0 fails, the frontend will see this error
        return res.status(500).json({ text: `AI Error: ${data.error.message}. Check Render Logs for available models.` });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
        console.error("Empty Result:", JSON.stringify(data, null, 2));
        return res.json({ text: "Unable to generate plan. (AI returned empty response)" });
    }

    res.json({ text: result }); 

  } catch (error) {
    console.error("Server Crash:", error);
    res.status(500).json({ error: "Server internal error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  // Run the diagnostic check on startup
  listAvailableModels();
});
