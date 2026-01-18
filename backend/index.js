import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let cachedModelName = null;

// Helper: Find a working model dynamically
async function getValidModel() {
  if (cachedModelName) return cachedModelName;

  try {
    console.log("🔍 Querying Google for available models...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const data = await response.json();

    if (!data.models) {
      console.error("❌ API returned no models. Check your API Key permissions.");
      return null;
    }

    // Filter for models that support "generateContent"
    const validModels = data.models.filter(m => 
      m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")
    );

    if (validModels.length > 0) {
      // Prefer standard names if available, otherwise take the first one
      const preferred = validModels.find(m => m.name.includes("gemini-1.5-flash")) || validModels[0];
      
      // The API returns names like "models/gemini-pro", but the generate endpoint needs just "gemini-pro"
      // or sometimes the full name works depending on the endpoint version. 
      // We will use the 'name' field directly as provided by the list API.
      cachedModelName = preferred.name.replace("models/", "");
      
      console.log(`✅ Auto-selected valid model: ${cachedModelName}`);
      return cachedModelName;
    }

    console.error("❌ No models found that support content generation.");
    return null;

  } catch (error) {
    console.error("❌ Failed to list models:", error.message);
    return null;
  }
}

app.get("/", (req, res) => {
  res.send("AI Diet Backend is running 🚀");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body; 
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    // 1. Get a valid model name
    const modelName = await getValidModel();
    if (!modelName) {
        return res.status(500).json({ text: "Server Error: No AI models available for this API Key." });
    }

    console.log(`🚀 Sending request using model: ${modelName}...`);

    // 2. Send the request
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
    
    // 3. Error Handling
    if (data.error) {
        console.error("Gemini API Error:", JSON.stringify(data.error, null, 2));
        return res.status(500).json({ text: `AI Error: ${data.error.message}` });
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
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
