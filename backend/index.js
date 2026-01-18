import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// List of models to try in order of preference
const MODELS_TO_TRY = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash-latest"
];

app.get("/", (req, res) => {
  res.send("AI Diet Backend is running 🚀");
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  let lastError = null;

  // LOOP: Try each model until one works
  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`🔄 Attempting to generate with model: ${modelName}...`);

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

      // If this model failed (404 Not Found or 429 Over Limit), throw error to trigger next loop
      if (data.error) {
        console.warn(`⚠️ Model ${modelName} failed:`, data.error.message);
        lastError = data.error.message;
        continue; // Try the next model in the list
      }

      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!result) {
        console.warn(`⚠️ Model ${modelName} returned empty result.`);
        lastError = "Empty response";
        continue; // Try the next model
      }

      // SUCCESS! We found a working model and got a result.
      console.log(`✅ Success! Generated plan using: ${modelName}`);
      return res.json({ text: result });

    } catch (error) {
      console.error(`❌ Network/Server error with ${modelName}:`, error.message);
      lastError = error.message;
    }
  }

  // If we loop through ALL models and none work:
  console.error("❌ All models failed.");
  res.status(500).json({ 
    text: `Unable to generate plan. All AI models failed. Last error: ${lastError}` 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
