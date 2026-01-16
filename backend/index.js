import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/generate-plan", async (req, res) => {
  try {
    const userData = req.body;

    const prompt = `
Create a safe weekly workout and diet plan based on:
Age: ${userData.age}
Gender: ${userData.gender}
Weight: ${userData.weight}
Height: ${userData.height}
Experience: ${userData.experience}
Goal: ${userData.goal}
Diet Preference: ${userData.diet}
`;

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

    const result =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate plan.";

    res.json({ plan: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
