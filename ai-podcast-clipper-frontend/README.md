# AI Podcast Clipper

AI Podcast Clipper is a powerful full-stack application designed to transform long-form podcast videos into engaging, short-form vertical content. By leveraging advanced AI models for transcription, content analysis, and computer vision, it automatically identifies viral moments, centers the active speaker, and burns in dynamic subtitles.

## 🚀 Features

- **Smart Clipping**: Uses **Google Gemini** to intelligently analyze transcripts and identify engaging Q&A segments or stories suitable for short clips (30-60s).
- **Active Speaker Detection**: Automatically tracks and crops the video to focus on the current speaker, converting landscape video to vertical (9:16) format perfect for TikTok, Shorts, and Reels.
- **AI Transcription**: Powered by **WhisperX** for high-accuracy speech-to-text with precise word-level timestamps.
- **Dynamic Subtitles**: Automatically generates and burns in stylish, perfectly timed subtitles.
- **Full-Stack Architecture**: Built with the **T3 Stack** (Next.js, tRPC, Prisma) and **Modal** for scalable serverless AI processing.
- **Background Processing**: Robust job orchestration using **Inngest**.

## 🛠 Tech Stack

### Frontend & App Logic
- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) & [Shadcn UI](https://ui.shadcn.com)
- **Database**: [PostgreSQL](https://postgresql.org) with [Prisma ORM](https://prisma.io)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **Job Queue**: [Inngest](https://www.inngest.com)
- **Storage**: [AWS S3](https://aws.amazon.com/s3)
- **Payments**: [Stripe](https://stripe.com)

### AI Backend (Python/Modal)
- **Infrastructure**: [Modal](https://modal.com) (Serverless GPU)
- **Transcription**: [WhisperX](https://github.com/m-bain/whisperX)
- **LLM**: [Google Gemini](https://deepmind.google/technologies/gemini/) (via `google-genai`)
- **Video Processing**: FFmpeg, OpenCV, generic active speaker detection scripts.

## 📦 Project Structure

```
├── ai-podcast-clipper-frontend  # Next.js web application
└── ai-podcast-clipper-backend   # Python/Modal scripts for AI processing
```

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (for backend development)
- PostgreSQL database
- AWS S3 bucket
- Google Gemini API Key
- Modal account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-podcast-clipper/ai-podcast-clipper-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file and fill in your secrets.
   ```bash
   cp .env.example .env
   ```
   *See `.env.example` for the required variables.*

4. **Database Setup**
   Push the schema to your database.
   ```bash
   npm run db:push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

6. **Start Inngest Dev Server** (in a separate terminal)
   To handle background events locally:
   ```bash
   npm run inngest-dev
   ```
   Open `http://localhost:8288` to utilize the Inngest dashboard.

## 🧠 Backend Deployment (Modal)

The heavy lifting (transcription, cropping, rendering) happens on the backend using Modal.

1. Navigate to the backend directory:
   ```bash
   cd ../ai-podcast-clipper-backend
   ```

2. Install Modal and setup authentication:
   ```bash
   pip install modal
   modal setup
   ```

3. Deploy or run the app:
   ```bash
   modal deploy main.py
   # OR run ephemerally
   modal run main.py
   ```

## 📜 Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run inngest-dev`: Starts the Inngest local development server.
- `npm run db:push`: Pushes the Prisma schema state to the database.
- `npm run db:studio`: Opens Prisma Studio to view database records.
