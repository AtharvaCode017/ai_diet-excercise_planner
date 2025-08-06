# AI Fitness & Diet Planner

An intelligent web application that leverages Google's Gemini API to generate personalized, downloadable weekly workout and diet plans. This tool is designed to provide users with a safe, customized, and easy-to-follow fitness schedule.

## ✨ Key Features

-   **Deep Personalization:** Creates plans based on age, gender, weight, height, and **fitness experience level** (Beginner, Regular, Advanced).
-   **Smart BMI Analysis:** Features a live, interactive visual BMI gauge that gives users immediate feedback on their status.
-   **Responsible AI:** Includes safety checks to prevent the generation of unsafe plans (e.g., "Fat Loss" for a critically underweight user).
-   **Goal-Oriented Planning:** Tailors workout and diet strategies for specific goals like Fat Loss, Strength Training, Muscle Building, or Weight Gain.
-   **Culturally-Aware Diet Plans:** Generates diet options suitable for the Indian context by explicitly excluding beef and pork.
-   **Downloadable Poster:** Allows users to download their complete weekly plan as a high-quality **JPG** or **PDF**, perfect for a reference poster.
-   **Intuitive UI:** Clean, responsive, and user-friendly interface built with Tailwind CSS.

---

## ⚙️ How It Works

The application follows a simple yet powerful client-side workflow:

1.  **User Input & Validation:** The user fills out the form. JavaScript instantly validates inputs (like age range) and displays the live BMI on the visual gauge.
2.  **Safety & Goal Check:** Before submitting to the AI, the app checks the user's BMI against their chosen goal to ensure it's a responsible recommendation.
3.  **Dynamic Prompt Engineering:** A detailed, structured prompt is constructed using all the user's data, including specific instructions for the AI to follow (like excluding certain foods and tailoring exercise difficulty).
4.  **API Call to Gemini:** This comprehensive prompt is sent to the **Google Gemini API**.
5.  **AI-Generated Plan:** The Gemini model processes the request and generates a complete fitness and diet plan structured in Markdown format.
6.  **Render & Download:** The app parses the Markdown into clean HTML to display on the page. It then uses `html2canvas` and `jspdf` to convert this HTML content into downloadable JPG and PDF files.

---

## 🛠️ Tech Stack

-   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **AI Engine:** [Google Gemini API](https://ai.google.dev/)
-   **PDF/Image Generation:**
    -   [html2canvas](https://html2canvas.hertzen.com/): To capture the plan as an image.
    -   [jsPDF](https://github.com/parallax/jsPDF): To convert the captured image into a PDF document.

---

## 🚀 Getting Started

This project runs entirely on the client-side, so no complex setup is needed.

### Prerequisites

-   A modern web browser.
-   A Google Gemini API Key. You can get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/ai-fitness-planner.git](https://github.com/your-username/ai-fitness-planner.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd ai-fitness-planner
    ```
3.  **Add your API Key:**
    -   Open the `index.html` file in a code editor.
    -   Find the line `const apiKey = "YOUR_API_KEY_HERE";`.
    -   Replace `"YOUR_API_KEY_HERE"` with your actual Gemini API key.
4.  **Run the application:**
    -   The easiest way is to use a live server extension (like "Live Server" for VS Code).
    -   Alternatively, you can simply open the `index.html` file directly in your web browser.

---

## ⚠️ Disclaimer

This application is an AI-powered tool intended for informational and educational purposes only. It is not a substitute for professional medical or fitness advice. Always consult with a qualified healthcare professional or a certified fitness trainer before beginning any new diet or exercise program.
