# AI Portfolio Template

A modern, AI-powered developer portfolio template featuring a voice-enabled AI assistant, dynamic content generation from your resume, and Google Calendar integration.

![Portfolio Screenshot](./public/screenshot.png) 
*(Note: You'll need to add a screenshot here)*

## ✨ Features

- **AI Assistant**: A fully functional RAG-like chat agent that answers questions about your experience, projects, and skills.
- **Voice Mode**: Speak to the AI agent with a live audio visualizer.
- **Resume Extractor**: Automated script to parse your resume PDF and populate the entire portfolio.
- **Dynamic AI Theming**: The AI analyzes your resume and generates a unique color palette and design vibe for your portfolio.
- **Dynamic Content**: All sections (Hero, Experience, Projects, Skills) are powered by a single `profile.json` file.
- **Booking Integration**: Direct integration with Google Calendar Appointment Scheduling.
- **Dual AI Provider**: Switch between **Gemini** (cloud) and **Ollama** (local/private) for both generation and chat.
- **Modern UI**: Built with React, TypeScript, Tailwind CSS, and Lucide Icons.

## ✅ Prerequisites

- Node.js (v18+)
- Google Cloud Project with **Gemini API** enabled (for Gemini model)
- **Ollama** installed locally (for local model support)
- A PDF or Text version of your Resume

## 🚀 Quick Start

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/arpitkorde/Portfolio-AI_Agent.git
    cd Portfolio-AI_Agent
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the project root (copy from the template below). **Never commit this file** — it is already in `.gitignore`.
    ```bash
    # .env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```
    Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

    > **Note:** If you don't want to use a `.env` file, you can also pass the key directly:
    > ```bash
    > node scripts/generate-profile.js ./resume.pdf --api-key=YOUR_KEY
    > ```

4.  **Generate Your Profile**
    Place your resume PDF in the project root and run:
    ```bash
    # Option A: Use Gemini (Default) — reads VITE_GEMINI_API_KEY from .env
    node scripts/generate-profile.js ./resume.pdf

    # Option B: Pass key directly
    node scripts/generate-profile.js ./resume.pdf --api-key=YOUR_KEY

    # Option C: Use Ollama (Local/Private) — no API key needed
    node scripts/generate-profile.js ./resume.pdf --provider=ollama
    ```
    This generates `data/profile.json` with your resume content **and** a custom AI-generated theme.

5.  **Run Locally**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:5173` to see your portfolio!

5.  **Run with Ollama (Local AI)**
    To use the local AI model in the chat interface:
    1.  Install [Ollama](https://ollama.com/).
    2.  Pull the Llama 3.2 model:
        ```bash
        ollama pull llama3.2
        ```
    3.  Run Ollama with CORS enabled (Required for browser access):
        ```bash
        # Linux/Mac
        OLLAMA_ORIGINS="*" ollama serve

        # Windows (Powershell)
        $env:OLLAMA_ORIGINS="*"; ollama serve
        ```
    4.  In the portfolio chat interface, toggle the provider to **OLLAMA**.

## ⚙️ Configuration

### 1. Profile Data (`data/profile.json`)
The `generate-profile.js` script populates most of this, but you can manually edit `data/profile.json` to fine-tune your content.
- **headline**: Used in the Hero section.
- **contact_info.calendar**: Add your Google Calendar Appointment Schedule link here to enable the "Book Meeting" feature.

### 2. Site Config (`constants.ts`)
This file exports the configuration used throughout the app. It automatically imports from `profile.json`. You usually don't need to touch this unless you want to change the logic.

### 3. Dynamic AI Theme
Running `generate-profile.js` automatically sets a custom color palette based on your resume's personality. The colors are stored in `data/profile.json` under the `theme` key and applied at runtime via CSS variables. You can also manually edit those values in `profile.json`.

## 📦 Deployment

### Vercel / Netlify
1.  Push your code to GitHub.
2.  Import the project into Vercel/Netlify.
3.  Add `VITE_GEMINI_API_KEY` to the deployment's Environment Variables.
4.  Deploy!

### Docker / Cloud Run
Build the Docker image:
```bash
docker build -t portfolio-template .
```
Run locally:
```bash
docker run -p 8080:8080 -e VITE_GEMINI_API_KEY=your_key portfolio-template
```

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License
MIT
