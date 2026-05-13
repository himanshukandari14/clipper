import { Inngest } from "inngest";

/**
 * Match the local Inngest Dev Server (`npx inngest-cli dev` / `npm run inngest-dev`).
 * Without this, NODE_ENV checks + missing signing key put the SDK in "cloud" mode and
 * `/api/inngest` can 500 during sync/probe requests.
 */
const isLocalInngestDev =
  process.env.NODE_ENV === "development" ||
  process.env.INNGEST_DEV === "1" ||
  process.env.INNGEST_DEV === "true";

export const inngest = new Inngest({
  id: "ai-podcast-clipper-frontend",
  isDev: isLocalInngestDev,
});
