# Deployment Checklist (Vercel)

## Dashboard "Application error" Fixes

### 1. Environment Variables (Vercel Project Settings → Environment Variables)

Ensure **all** of these are set for Production:

| Variable | Required | Notes |
|----------|----------|-------|
| `AUTH_GOOGLE_ID` | Yes | From Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | Yes | From Google Cloud Console |
| `AUTH_SECRET` | Yes | Run `openssl rand -base64 32` to generate |
| `DATABASE_URL` | Yes | Use Neon **pooler** URL for serverless (ends with `-pooler`) |
| `AWS_ACCESS_KEY_ID` | Yes | For S3 clip storage |
| `AWS_SECRET_ACCESS_KEY` | Yes | |
| `AWS_REGION` | Yes | e.g. `ap-south-1` |
| `S3_BUCKET_NAME` | Yes | |
| `BASE_URL` | Yes | `https://clipper-pi.vercel.app` (your production URL) |
| `PROCESS_VIDEO_ENDPOINT` | Yes | Modal/backend URL |
| `PROCESS_VIDEO_ENDPOINT_AUTH` | Yes | |
| `STRIPE_*` | Yes | All Stripe keys and price IDs |
| `STRIPE_WEBHOOK_SECRET` | Yes | From Stripe Dashboard (use production webhook) |

### 2. Google OAuth Redirect URI

In [Google Cloud Console](https://console.cloud.google.com/) → Credentials → your OAuth client:

Add to **Authorized redirect URIs**:
```
https://clipper-pi.vercel.app/api/auth/callback/google
```

### 3. Neon Database (Serverless)

Use the **connection pooler** URL, not the direct connection:
- Format: `postgresql://user:pass@ep-xxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
- The `-pooler` in the hostname is important for Vercel serverless

---

## Video Clips Not Showing

### 1. S3 Bucket CORS

Your S3 bucket needs CORS configured for the browser to load videos. In AWS S3 → Bucket → Permissions → CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://clipper-pi.vercel.app",
      "http://localhost:3000"
    ],
    "ExposeHeaders": []
  }
]
```

### 2. AWS Credentials on Vercel

Ensure `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` are set. The IAM user must have `s3:GetObject` permission on the bucket.

### 3. Check Vercel Logs

Go to Vercel → Project → Logs. Filter by the error digest (e.g. `3920437467`) to see the actual error. Common causes:
- Database connection timeout
- Missing env var
- Auth/session mismatch
