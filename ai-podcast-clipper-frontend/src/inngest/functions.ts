import { env } from "~/env";
import { inngest } from "./client";
import { db } from "~/server/db";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

export const processVideo = inngest.createFunction(
  {
    id: "process-video",
    retries: 1,
    concurrency: {
      limit: 1,
      key: "event.data.userId",
    },
    // Modal cold-starts an L40S GPU container which alone can take 10-14 min,
    // plus 2-3 min execution.  25 min covers worst-case cold start + processing.
    timeouts: {
      finish: "25m",   // total function wall-clock limit
    },
    cancelOn: [{ event: "process-video/cancel", match: "data.uploadedFileId" }],
    onFailure: async ({ event }) => {
      const uploadedFileId = (event.data.event.data as { uploadedFileId: string }).uploadedFileId;
      const file = await db.uploadedFile.findUnique({
        where: { id: uploadedFileId },
        select: { status: true },
      });
      if (file?.status === "processing") {
        await db.uploadedFile.update({
          where: { id: uploadedFileId },
          data: { status: "cancelled" },
        });
      }
    },
    triggers: [{ event: "process-video-events" }],
  },
  async ({ event, step }) => {
    const { uploadedFileId, prompt } = event.data as {
      uploadedFileId: string;
      userId: string;
      prompt: string | null;
    };

    try {
      const { userId, credits, s3Key } = await step.run(
        "check-credits",
        async () => {
          const uploadedFile = await db.uploadedFile.findUniqueOrThrow({
            where: {
              id: uploadedFileId,
            },
            select: {
              user: {
                select: {
                  id: true,
                  credits: true,
                },
              },
              s3Key: true,
            },
          });

          return {
            userId: uploadedFile.user.id,
            credits: uploadedFile.user.credits,
            s3Key: uploadedFile.s3Key,
          };
        },
      );

      if (credits > 0) {
        await step.run("set-status-processing", async () => {
          await db.uploadedFile.update({
            where: {
              id: uploadedFileId,
            },
            data: {
              status: "processing",
            },
          });
        });

        await step.run("invoke-processor", async () => {
          // ── DEV FAILURE SIMULATION ──────────────────────────
          // Flip MOCK_FAILURE="true" in .env to instantly fail this step and
          // exercise the full failure notification flow (toast, badge, banner).
          if (process.env.MOCK_FAILURE === "true") {
            throw new Error(
              "[MOCK_FAILURE] Simulated processor failure — set MOCK_FAILURE=\"false\" in .env to disable.",
            );
          }
          // ──────────────────────────────────────────────────────────────────
          // Modal cold-starts an L40S GPU container (10-14 min) then runs
          // processing (2-3 min).  23 min covers worst-case while staying
          // under the 25 min Inngest finish timeout.
          const response = await fetch(env.PROCESS_VIDEO_ENDPOINT, {
            method: "POST",
            body: JSON.stringify({ s3_key: s3Key, prompt: prompt ?? undefined }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.PROCESS_VIDEO_ENDPOINT_AUTH}`,
            },
            signal: AbortSignal.timeout(1_380_000),
          });
          const bodySnippet = await response
            .text()
            .then((t) => t.slice(0, 280))
            .catch(() => "");
          if (!response.ok) {
            throw new Error(
              `Processor HTTP ${response.status}${bodySnippet ? `: ${bodySnippet}` : ""}`,
            );
          }
        });

        const { clipsFound } = await step.run(
          "create-clips-in-db",
          async () => {
            const folderPrefix = s3Key.split("/")[0]!;

            const allKeys = await listS3ObjectsByPrefix(folderPrefix);

            const clipKeys = allKeys.filter(
              (key): key is string =>
                key !== undefined && !key.endsWith("original.mp4"),
            );

            if (clipKeys.length > 0) {
              await db.clip.createMany({
                data: clipKeys.map((clipKey) => ({
                  s3Key: clipKey,
                  uploadedFileId,
                  userId,
                })),
              });
            }

            return { clipsFound: clipKeys.length };
          },
        );

        await step.run("deduct-credits", async () => {
          await db.user.update({
            where: {
              id: userId,
            },
            data: {
              credits: {
                decrement: Math.min(credits, clipsFound),
              },
            },
          });
        });

        await step.run("set-status-processed", async () => {
          await db.uploadedFile.update({
            where: {
              id: uploadedFileId,
            },
            data: {
              status: "processed",
            },
          });
        });
      } else {
        await step.run("set-status-no-credits", async () => {
          await db.uploadedFile.update({
            where: {
              id: uploadedFileId,
            },
            data: {
              status: "no credits",
            },
          });
        });
      }
    } catch {
      await step.run("set-status-failed", async () => {
        await db.uploadedFile.update({
          where: {
            id: uploadedFileId,
          },
          data: {
            status: "failed",
          },
        });
      });
    }
  },
);

async function listS3ObjectsByPrefix(prefix: string) {
  const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const listCommand = new ListObjectsV2Command({
    Bucket: env.S3_BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await s3Client.send(listCommand);
  return response.Contents?.map((item) => item.Key).filter(Boolean) ?? [];
}


export const handleCancelledRun = inngest.createFunction(
  {
    id: "handle-cancelled-run",
    retries: 3,
    triggers: [{ event: "inngest/function.cancelled" }],
  },
  async ({ event }) => {
    // Only handle cancellations of the process-video function
    const functionId = (event.data as Record<string, unknown>).function_id as string | undefined;
    if (!functionId?.includes("process-video")) return;

    const triggerEvent = (event.data as Record<string, unknown>).event as
      | { data?: { uploadedFileId?: string } }
      | undefined;
    const uploadedFileId = triggerEvent?.data?.uploadedFileId;
    if (!uploadedFileId) return;

    const file = await db.uploadedFile.findUnique({
      where: { id: uploadedFileId },
      select: { status: true },
    });

    // Only update if it's still stuck in "processing"
    if (file?.status === "processing") {
      await db.uploadedFile.update({
        where: { id: uploadedFileId },
        data: { status: "failed" },
      });
    }
  },
);

