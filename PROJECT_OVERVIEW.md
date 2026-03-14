# AI Podcast Clipper — Project Overview (Interview Prep)

This document explains how the app works, which libraries and models are used, and the end-to-end flow — useful for answering project deep-dives in interviews.

---

## 1. What Does the App Do?

**AI Podcast Clipper** turns long podcast videos into short, vertical clips (e.g. for TikTok/Reels):

1. User uploads a podcast video (MP4).
2. Backend transcribes the video, finds “clip-worthy” moments (e.g. Q&A, stories) using AI, and generates up to 5 vertical clips (9:16) with face-framing and burn-in subtitles.
3. User sees status in the dashboard and can play or download clips.

So in one sentence: **Upload podcast video → get AI-selected vertical clips with subtitles and smart framing.**

---

## 2. High-Level Architecture

- **Frontend**: Next.js 15 app (React 19) — auth, upload UI, dashboard, clip playback.
- **Backend (heavy lifting)**: Python service on **Modal** (serverless GPU) — transcription, moment detection, clip creation.
- **Orchestration**: **Inngest** — triggers and steps (credits, status, calling Modal, writing clips to DB).
- **Storage**: **AWS S3** — original video + generated clips.
- **Database**: **PostgreSQL** via **Prisma** — users, uploads, clips, credits.
- **Payments**: **Stripe** — credit packs (billing page + webhooks).

```
User → Next.js (upload) → S3 (video) → Inngest → Modal (transcribe + clip) → S3 (clips) → DB (clip records)
                                                                                    ↓
User ← Dashboard (status, play/download clips via signed S3 URLs) ←──────────────────┘
```

---

## 3. Tech Stack & Libraries (What We Use and Why)

### Frontend (Next.js)

| Library / Tech | Purpose |
|----------------|--------|
| **Next.js 15** | App router, server components, API routes, server actions |
| **React 19** | UI and client components |
| **NextAuth (Auth.js) v5** | Auth (credentials + JWT), session, Prisma adapter |
| **Prisma** | ORM for PostgreSQL (User, UploadedFile, Clip, Account, Session, etc.) |
| **Tailwind CSS** | Styling |
| **shadcn/ui** (Radix) | Buttons, cards, tabs, table, badge, dropdown, etc. |
| **shadcn-dropzone** | Drag-and-drop file upload |
| **Inngest** | Event-driven job queue: trigger processing, retries, step-based flow |
| **AWS SDK (S3)** | Presigned URLs for upload and for clip playback/download |
| **Stripe** | Checkout and webhooks for credit purchases |
| **Zod** | Schema validation (e.g. env, forms) |
| **bcryptjs** | Password hashing (register/login) |
| **Sonner** | Toast notifications |
| **react-hook-form + @hookform/resolvers** | Form handling and validation |

### Backend (Modal / Python)

| Library / Tech | Purpose |
|----------------|--------|
| **Modal** | Serverless GPU platform: run WhisperX + alignment + Gemini + FFmpeg on L40S GPU, with secrets and volume for model cache |
| **WhisperX** | Speech-to-text (Whisper large-v2) + **word-level alignment** (critical for subtitles and clip boundaries) |
| **Google GenAI (Gemini)** | LLM to pick clip moments from transcript (Q&A, stories; 30–60 s, no overlap) |
| **FFmpeg** | Extract audio, cut segments, merge video+audio, burn subtitles |
| **OpenCV (cv2)** | Image processing for vertical video: resize, crop, blur background, face-based framing |
| **ffmpegcv** | Video I/O with GPU (e.g. NVENC) for faster encode |
| **pysubs2** | ASS subtitle authoring (timing + styling) before burning with FFmpeg |
| **Boto3** | Download input from S3, upload clip MP4s to S3 |
| **FastAPI** | Single POST endpoint for “process this S3 key”, protected by Bearer token |
| **PyTorch / torchaudio** | Backend for WhisperX |
| **Columbia script** (custom) | Face tracking and “importance” scores per frame (used to decide crop/focus in vertical video); runs as subprocess with a finetuned model |

---

## 4. AI/ML Models Used

1. **Whisper large-v2 (via WhisperX)**  
   - **Role**: Transcribe full podcast audio to text.  
   - **Why WhisperX**: Adds **word-level timestamps** (alignment model) so we get exact start/end per word — required for clip boundaries and subtitle timing.  
   - **Run environment**: Modal with CUDA (GPU), float16.

2. **WhisperX alignment model**  
   - **Role**: Aligns Whisper segments to audio for word-level timing.  
   - **Language**: English in this codebase.

3. **Gemini 2.5 Flash (Google GenAI)**  
   - **Role**: Read the time-stamped transcript and output a list of clip intervals `[{start, end}, ...]` that are “clip-worthy” (e.g. Q&A, stories), 30–60 s, no overlap, on sentence boundaries.  
   - **Why this model**: Fast, good at following structured JSON instructions; we parse the response and use only the timestamps from the transcript.

4. **Columbia face-tracking model**  
   - **Role**: Produces face tracks and per-frame “scores” for the clip segment.  
   - **Usage**: Used in `create_vertical_video()` to choose whether to crop on the main face or fall back to resize + blurred background for vertical 1080×1920 output.

---

## 5. End-to-End Flow (Step by Step)

### 5.1 Upload and Kick Off Processing

1. User selects MP4 on dashboard; frontend calls server action `generateUploadUrl()`.
2. Server generates a **presigned S3 PUT URL** and creates an **UploadedFile** row (status `queued`, `uploaded: false`).
3. Browser **PUTs the file directly to S3** (no streaming through Next.js).
4. Frontend calls **`processVideo(uploadedFileId)`** which:
   - Marks the file as `uploaded: true`,
   - Sends an **Inngest event** `process-video-events` with `uploadedFileId` and `userId`.

### 5.2 Inngest Pipeline (`process-video` function)

Steps run in order; any failure can trigger retries (e.g. 1 retry):

1. **check-credits**  
   Load user’s credits and file’s `s3Key`. If credits ≤ 0 → set status to `no credits` and stop.

2. **set-status-processing**  
   Set `UploadedFile.status = "processing"`.

3. **Call Modal backend**  
   `step.fetch(PROCESS_VIDEO_ENDPOINT, { body: { s3_key: s3Key }, Authorization: Bearer ... })`.  
   Modal downloads the video from S3 and runs the full pipeline (transcribe → moments → clips → upload clips to S3).

4. **create-clips-in-db**  
   List S3 keys under the same “folder” prefix as the original file; filter out the original; for each clip key, create a **Clip** row linked to the **UploadedFile** and **User**.

5. **deduct-credits**  
   Decrement user credits by the number of clips created (capped by current credits).

6. **set-status-processed**  
   Set `UploadedFile.status = "processed"`.  
   On error, a catch block sets status to `"failed"`.

Concurrency: one concurrent run per `userId` (so one video per user at a time).

### 5.3 Modal Backend (Python) — Per Video

1. **Auth**  
   Validate `Authorization: Bearer` against `AUTH_TOKEN` from Modal secrets.

2. **Download**  
   Download object `s3_key` from S3 to a temp path (e.g. `input.mp4`).

3. **Transcribe**  
   - Extract 16 kHz mono WAV with FFmpeg.  
   - Load audio with WhisperX, run **Whisper large-v2** with batch size 16.  
   - Run **alignment** (word-level).  
   - Return JSON list of `{ start, end, word }`.

4. **Identify moments**  
   Send transcript to **Gemini 2.5 Flash** with a prompt that asks for a JSON array of `{ start, end }` clips (30–60 s, Q&A/stories, no overlap, sentence boundaries).  
   Strip markdown code fences if present and parse JSON. Take at most the first **5** moments.

5. **For each moment** (`process_clip`):  
   - Cut segment with FFmpeg (`-ss`, `-t`).  
   - Extract 16 kHz WAV for that segment.  
   - Run **Columbia script** (face tracking + scores), output e.g. `tracks.pckl` and `scores.pckl`.  
   - **create_vertical_video**: For each frame, decide crop vs resize using face scores; produce 1080×1920 vertical MP4 (with ffmpegcv/OpenCV), then mux with segment audio.  
   - **create_subtitles_with_ffmpeg**: From transcript segments in the clip’s time range, build ASS (e.g. 5 words per line, Anton font), then burn into video with FFmpeg.  
   - **Upload** the final clip MP4 to S3 (key like `{folder}/clip_0.mp4`, …).

6. **Cleanup**  
   Remove temp directory.

### 5.4 Dashboard and Clips

- **Dashboard** loads the user’s **UploadedFile** list (with status and clip count) and **Clip** list (ordered by creation).
- **Clip play**: Frontend calls `getClipPlayUrl(clipId)`. Server checks ownership, then generates a **presigned S3 GET URL** (e.g. 1 hour). Frontend uses this as `video` src or for download.

---

## 6. Data Models (Prisma) — Quick Reference

- **User**: id, email, password (hashed), credits, stripeCustomerId, etc.
- **UploadedFile**: s3Key, displayName, status (`queued` | `processing` | `processed` | `no credits` | `failed`), uploaded (boolean), userId.
- **Clip**: s3Key, uploadedFileId, userId.
- **Account / Session**: NextAuth (OAuth + credentials); credentials use JWT.

---

## 7. Security & Configuration

- **Auth**: NextAuth credentials (email + bcrypt); JWT session; Prisma adapter for DB sessions.
- **Modal**: Protected by shared secret in `AUTH_TOKEN` (Bearer). Stored in Modal secrets (`ai-podcast-clipper-secret`).
- **S3**: IAM credentials in env; presigned URLs limit exposure (upload 10 min, playback 1 hour).
- **Env**: T3 env (e.g. `~/env.js`) with Zod; `.env.example` lists DATABASE_URL, AWS_*, AUTH_SECRET, PROCESS_VIDEO_ENDPOINT, PROCESS_VIDEO_ENDPOINT_AUTH, Stripe, Inngest.

---

## 8. Interview-Style Q&A

**Q: What is the main value of the product?**  
Turn long podcast videos into short, vertical, subtitle-heavy clips suitable for social (e.g. Reels), with minimal user effort — AI picks the moments and handles framing and subtitles.

**Q: Why use Modal for the backend?**  
Heavy GPU work (WhisperX + alignment) and optional GPU encoding; Modal gives on-demand L40S, secrets, and a simple HTTP endpoint so the Next.js app doesn’t run long jobs. Scale-to-zero and no server management.

**Q: Why Inngest instead of calling Modal directly from the server action?**  
Processing is long-running and multi-step (credits, status updates, S3 listing, DB writes). Inngest gives retries, step-by-step progress, and concurrency control per user without blocking the HTTP request.

**Q: Why presigned S3 URLs for upload?**  
Upload goes straight from browser to S3; Next.js never holds the file in memory or on disk. Saves bandwidth and avoids body size limits on the server.

**Q: How do you get word-level timestamps?**  
WhisperX: Whisper gives segment-level transcription; a separate alignment model aligns to the audio and produces word-level start/end. We use these for clip boundaries and for subtitle timing (ASS).

**Q: How does the app decide “clip moments”?**  
The full word-level transcript is sent to Gemini 2.5 Flash with a prompt that asks for JSON `[{start, end}]` for 30–60 s clips (Q&A, stories, no overlap, on sentence boundaries). We parse that and take the first 5.

**Q: How are vertical videos and subtitles generated?**  
For each clip segment we run a Columbia face-tracking script to get per-frame face positions and scores. We then build a 1080×1920 video: either crop around the best-scoring face or resize with blurred background. Audio is muxed with FFmpeg. Subtitles are built from the transcript word segments (e.g. 5 words per line) into ASS format and burned in with FFmpeg.

**Q: How are credits enforced?**  
Before calling Modal, Inngest checks `user.credits`. If > 0, it runs processing; after creating clip rows it decrements credits by the number of clips. If credits are 0, status is set to `no credits` and Modal is never called.

---

## 9. File / Module Map (Where to Look)

| What | Where |
|------|--------|
| Upload URL + DB record | `frontend/src/actions/s3.ts` → `generateUploadUrl` |
| Trigger processing | `frontend/src/actions/generation.ts` → `processVideo`, `getClipPlayUrl` |
| Inngest pipeline | `frontend/src/inngest/functions.ts` → `processVideo` |
| Modal app + transcription + Gemini + clip creation | `backend/main.py` → `AiPodcastClipper` |
| Auth (credentials, JWT, Prisma) | `frontend/src/server/auth/config.ts`, `auth/index.ts`, `lib/auth.ts` |
| Dashboard UI | `frontend/src/app/dashboard/page.tsx`, `dashboard-client.tsx`, `clip-display.tsx` |
| Schema & DB | `frontend/prisma/schema.prisma` |
| Env vars | `frontend/.env.example`, `frontend/src/env.js` |

---

## 10. File-by-file: what each file does

Each file is described in one line: **what it does** and **why it exists**.

---

### Frontend — App (pages & layout)

| File | What it does |
|------|----------------|
| **`src/app/page.tsx`** | Landing page: hero (“Turn Podcasts into Viral Shorts”), nav (Features, Showcase, Pricing, Dashboard), and marketing visuals. No auth required. |
| **`src/app/layout.tsx`** | Root layout: wraps the whole app (fonts, body, Toaster). All pages render inside this. |
| **`src/app/login/page.tsx`** | Login page: renders the login form. Redirects to dashboard if already signed in. |
| **`src/app/signup/page.tsx`** | Signup page: renders the signup form. Creates user in DB + optional Stripe customer. |
| **`src/app/dashboard/page.tsx`** | Dashboard (server component): requires auth, loads user’s uploaded files and clips from DB, passes them to `DashboardClient`. |
| **`src/app/dashboard/layout.tsx`** | Dashboard layout: wraps dashboard routes (e.g. dashboard + billing) so they share the same shell. |
| **`src/app/dashboard/loading.tsx`** | Loading UI shown while the dashboard page is loading (e.g. suspense fallback). |
| **`src/app/dashboard/billing/page.tsx`** | Billing page: shows three credit packs (Small/Medium/Large), “Buy credits” buttons that start Stripe Checkout, and “How credits work” copy. |
| **`src/app/features/page.tsx`** | Features/marketing page describing product features. |
| **`src/app/showcase/page.tsx`** | Showcase/marketing page (e.g. examples or social proof). |

---

### Frontend — API routes

| File | What it does |
|------|----------------|
| **`src/app/api/auth/[...nextauth]/route.ts`** | NextAuth catch-all API: handles sign-in, sign-out, session, callbacks. Entry point for Auth.js. |
| **`src/app/api/inngest/route.ts`** | Inngest webhook endpoint: receives events from Inngest cloud and runs registered functions (e.g. `process-video`). |
| **`src/app/api/webhooks/stripe/route.ts`** | Stripe webhook: verifies signature, on `checkout.session.completed` maps price ID to credits (50/150/500) and increments `user.credits` in DB. |

---

### Frontend — Components

| File | What it does |
|------|----------------|
| **`src/components/dashboard-client.tsx`** | Dashboard UI (client): dropzone for MP4, “Upload and Generate Clips” flow (presigned URL → PUT to S3 → `processVideo`), queue table (file name, status, clip count), “My Clips” tab. |
| **`src/components/clip-display.tsx`** | Renders a grid of clip cards: each card fetches a presigned play URL via `getClipPlayUrl`, shows video or loading state, and has a Download button. |
| **`src/components/login-form.tsx`** | Login form: email/password, validation, calls sign-in. Used on the login page. |
| **`src/components/signup-form.tsx`** | Signup form: email/password, validation, calls `signUp` server action. Used on the signup page. |
| **`src/components/nav-header.tsx`** | Reusable nav/header (e.g. logo, links, auth state). Used on pages that need a shared header. |
| **`src/components/ui/*.tsx`** | shadcn/ui primitives: `button`, `card`, `input`, `label`, `tabs`, `table`, `badge`, `avatar`, `dropdown-menu`, `sonner` (toast). Styled, accessible building blocks. |
| **`src/components/ui/sonner.tsx`** | Wraps Sonner toaster so `toast.success` / `toast.error` work app-wide. |

---

### Frontend — Actions (server actions)

| File | What it does |
|------|----------------|
| **`src/actions/s3.ts`** | **`generateUploadUrl`**: creates presigned S3 PUT URL and an `UploadedFile` row (uploaded: false); returns URL + `uploadedFileId` so the client can upload directly to S3 then call `processVideo`. |
| **`src/actions/generation.ts`** | **`processVideo(uploadedFileId)`**: marks file as uploaded and sends Inngest event `process-video-events`. **`getClipPlayUrl(clipId)`**: checks ownership and returns a presigned S3 GET URL for that clip. |
| **`src/actions/auth.ts`** | **`signUp`**: validates with Zod, checks duplicate email, hashes password (bcrypt), optionally creates Stripe customer, inserts User in DB. |
| **`src/actions/stripe.ts`** | **`createCheckoutSession(priceId)`**: gets user’s `stripeCustomerId`, creates Stripe Checkout session for small/medium/large pack, redirects to Stripe. |

---

### Frontend — Server & config

| File | What it does |
|------|----------------|
| **`src/server/db.ts`** | Prisma client singleton: one `PrismaClient` per process (dev hot-reload safe). Used everywhere we touch the DB. |
| **`src/server/auth/config.ts`** | NextAuth config: credentials provider (email/password + bcrypt), JWT session, Prisma adapter, callbacks that put `user.id` on session and token. |
| **`src/server/auth/index.ts`** | Re-exports NextAuth (`auth`, `handlers`, `signIn`, `signOut`) with a cached `auth()` for use in server components/actions. |
| **`src/lib/auth.ts`** | **`hashPassword`** and **`comparePasswords`** using bcrypt (e.g. 12 rounds). Used at signup and login. |
| **`src/lib/utils.ts`** | Util (e.g. `cn()` for merging Tailwind classes). Used across UI components. |
| **`src/env.js`** | T3 env: Zod schema for all env vars (DB, AWS, Modal, Stripe, Inngest, etc.). Validates at build/start so the app never runs with missing/invalid env. |
| **`src/schemas/auth.ts`** | Zod schemas for login and signup (email, password rules). Used by auth actions and forms. |

---

### Frontend — Inngest

| File | What it does |
|------|----------------|
| **`src/inngest/client.ts`** | Inngest client instance (app id). Used to send events and register functions. |
| **`src/inngest/functions.ts`** | **`process-video`** function: on `process-video-events`, runs steps—check credits, set processing, POST to Modal, list S3 clips, create Clip rows, deduct credits, set processed (or no-credits/failed). Concurrency: one run per user. |

---

### Frontend — Styles & config files

| File | What it does |
|------|----------------|
| **`src/styles/globals.css`** | Global CSS: Tailwind directives, theme variables (e.g. colors), base styles. |
| **`prisma/schema.prisma`** | DB schema: Postgres datasource, models (User, Account, Session, Post, UploadedFile, Clip, VerificationToken). Defines relations and indexes. |
| **`next.config.js`** | Next.js config (e.g. turbo, images). |
| **`tsconfig.json`** | TypeScript config and path alias (`~/` → `src/`). |
| **`components.json`** | shadcn/ui config (paths, style). |

---

### Backend (Python — Modal)

| File | What it does |
|------|----------------|
| **`main.py`** | Modal app: **image** = CUDA 12.4 + ffmpeg, fonts, `asd` dir. **`AiPodcastClipper`** class: loads WhisperX large-v2 + alignment model and Gemini client; exposes **POST** `process_video(s3_key)` (Bearer auth). Flow: download from S3 → transcribe (WhisperX + align) → `identify_moments` (Gemini) → for each of first 5 moments run **`process_clip`** (cut segment, Columbia script, **`create_vertical_video`**, **`create_subtitles_with_ffmpeg`**, upload clip to S3). **`create_vertical_video`**: uses tracks/scores from Columbia to crop on best face or resize+blur per frame, writes 1080×1920 with ffmpegcv, muxes audio. **`create_subtitles_with_ffmpeg`**: builds ASS from word segments (e.g. 5 words per line), burns into video. **`process_clip`**: FFmpeg cut, extract WAV, run Columbia, then the two helpers above. |
| **`ytdownload.py`** | Standalone script: downloads a YouTube video with pytubefix (highest resolution). Not used by the Modal pipeline; useful for grabbing test podcasts. |
| **`requirements.txt`** | Python deps: torch, whisperx, google-genai, opencv, ffmpegcv, pysubs2, boto3, fastapi, etc. Used by Modal image build. |

---

### Backend — `asd` (Columbia / active-speaker)

| File | What it does |
|------|----------------|
| **`asd/ASD.py`** | PyTorch **ASD (Active Speaker Detection)** module: audio + visual frontends, audio-visual backend, training/eval loop, loss (AV + V). Used to train or evaluate “who is speaking” per frame. The Modal pipeline runs **Columbia_test.py** (in the same `asd` dir copied to `/asd`), which uses this kind of model to produce **tracks** (face bboxes per frame) and **scores** (importance per track/frame) for vertical video framing. |

---

### Config / env (reference)

| File | What it does |
|------|----------------|
| **`.env.example`** | Template for env vars: DB, AWS, AUTH_SECRET, Modal endpoint + auth, Stripe keys and price IDs, Inngest, BASE_URL. Copy to `.env` and fill in. |

---

This gives you a per-file map for “what does this file do?” in interviews or when navigating the repo.
