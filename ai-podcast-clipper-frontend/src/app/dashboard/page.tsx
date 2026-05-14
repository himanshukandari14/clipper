"use server";

import { redirect } from "next/navigation";
import { DashboardClient } from "~/components/dashboard-client";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const userData = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      uploadedFiles: {
        where: {
          uploaded: true,
        },
        select: {
          id: true,
          s3Key: true,
          displayName: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              clips: true,
            },
          },
        },
      },
      clips: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          uploadedFile: {
            select: {
              id: true,
              displayName: true,
              prompt: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!userData) {
    redirect("/");
  }

  // ── Stale detection ────────────────────────────────────────────────
  // If a run has been "processing" for over 30 min, it's dead — mark it
  // failed so the UI doesn't show a spinner forever.
  const STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes
  const now = Date.now();
  for (const file of userData.uploadedFiles) {
    if (
      file.status === "processing" &&
      now - file.updatedAt.getTime() > STALE_THRESHOLD_MS
    ) {
      await db.uploadedFile.update({
        where: { id: file.id },
        data: { status: "failed" },
      });
      file.status = "failed";
    }
  }

  const formattedFiles = userData.uploadedFiles.map((file) => ({
    id: file.id,
    s3Key: file.s3Key,
    filename: file.displayName ?? "Unknown filename",
    status: file.status,
    clipsCount: file._count.clips,
    createdAt: file.createdAt,
  }));

  const isMockFailureMode = process.env.MOCK_FAILURE === "true";

  return (
    <DashboardClient
      uploadedFiles={formattedFiles}
      clips={userData.clips}
      isMockFailureMode={isMockFailureMode}
    />
  );
}
