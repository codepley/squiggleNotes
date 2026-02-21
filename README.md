# SquiggleNotes

Your digital notebook for limitless creativity. Draw, write, and extract insights with AI.

## ✨ Features

- **Infinite Canvas:** A smooth, responsive drawing canvas with pen and eraser tools, customizable colors, and adjustable stroke sizes.
- **AI-Powered Transcription & Insights:** Draw your notes and use the built-in Gemini AI integration to extract handwriting into digital text and generate contextual insights based on your notes.
- **Organization & Search:** Keep your notes organized with unlimited nested folders. Use the unified search on the landing page or sidebar to instantly find notes by title, checking both note content and folder names.
- **Landing Page Dashboard:** A beautiful, responsive landing page showing your most recent notes, providing quick access to notes and global search.
- **Local Storage Memory:** All your strokes, folders, and settings are saved automatically to your local browser storage so you never lose your work.
- **Modern UI:** Built with Tailwind CSS, offering a clean, premium, and responsive user experience.

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure AI (Optional but recommended):**
   Create a `.env.local` file in the root directory and add your Google Gemini API key to enable handwriting extraction and insights:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the localhost URL provided in your terminal.

## 🛠 Tech Stack

- React 18+
- TypeScript
- Vite
- Tailwind CSS v4
- Google Gemini API (`@google/genai`)
