"use client";

import Dropzone from "shadcn-dropzone";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Loader2,
  UploadCloud,
  CheckCircle2,
  ListVideo,
  AlertCircle,
  CircleDot,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { generateUploadUrl } from "~/actions/s3";
import { toast } from "sonner";
import { processVideo } from "~/actions/generation";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useRouter } from "next/navigation";
import { ClipDisplay, type ClipWithSource } from "./clip-display";
import { cn } from "~/lib/utils";

type UploadRow = {
  id: string;
  s3Key: string;
  filename: string;
  status: string;
  clipsCount: number;
  createdAt: Date;
};

const EXTRACTION_BRIEF_IDEAS = [
  "Funniest moments and banter between hosts",
  "Hot takes, disagreements, and debate clips",
  "Actionable advice and how-to snippets",
  "Emotional or personal stories worth sharing",
] as const;

function statusBadge(item: UploadRow) {
  switch (item.status) {
    case "queued":
      return (
        <Badge
          variant="outline"
          className="border-zinc-600/60 bg-zinc-900/50 text-zinc-400 font-medium"
        >
          <CircleDot className="text-zinc-500" />
          Queued
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/35 bg-amber-950/40 text-amber-200 font-medium"
        >
          <Loader2 className="size-3 animate-spin text-amber-400" />
          Processing
        </Badge>
      );
    case "processed":
      if (item.clipsCount === 0) {
        return (
          <Badge
            variant="outline"
            className="border-zinc-500/40 bg-zinc-900/50 text-zinc-300 font-medium"
          >
            <CheckCircle2 className="text-zinc-400" />
            No clips found (Refunded)
          </Badge>
        );
      }
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/40 bg-emerald-950/35 text-emerald-200 font-medium"
        >
          <CheckCircle2 className="text-emerald-400" />
          Processed
        </Badge>
      );
    case "no credits":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/40 bg-amber-950/40 text-amber-200 font-medium"
        >
          <AlertCircle className="text-amber-400" />
          Insufficient credits
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="outline"
          className="border-red-500/45 bg-red-950/35 text-red-200 font-medium"
        >
          <AlertCircle className="text-red-400" />
          Failed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="border-zinc-500/40 bg-zinc-900/50 text-zinc-300 font-medium"
        >
          <AlertCircle className="text-zinc-400" />
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-zinc-600 text-zinc-400">
          {item.status}
        </Badge>
      );
  }
}

export function DashboardClient({
  uploadedFiles,
  clips,
  isMockFailureMode = false,
}: {
  uploadedFiles: UploadRow[];
  clips: ClipWithSource[];
  isMockFailureMode?: boolean;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const isFirstStatusHydration = useRef(true);
  const prevUploadSnapshot = useRef(
    {} as Record<string, { status: string; clipsCount: number }>,
  );

  const hasActiveJobs = useMemo(
    () =>
      uploadedFiles.some(
        (f) => f.status === "queued" || f.status === "processing",
      ),
    [uploadedFiles],
  );

  useEffect(() => {
    const map = Object.fromEntries(
      uploadedFiles.map((f) => [
        f.id,
        { status: f.status, clipsCount: f.clipsCount },
      ]),
    );

    if (isFirstStatusHydration.current) {
      isFirstStatusHydration.current = false;
      prevUploadSnapshot.current = map;
      return;
    }

    for (const f of uploadedFiles) {
      const before = prevUploadSnapshot.current[f.id];
      prevUploadSnapshot.current[f.id] = {
        status: f.status,
        clipsCount: f.clipsCount,
      };
      if (!before || before.status === f.status) continue;

      if (f.status === "processed") {
        if (f.clipsCount === 0) {
          toast.warning("Processing finished", {
            description:
              `"${f.filename}" completed but no clips were detected. You have not been charged any credits.`,
            duration: 7000,
          });
        } else {
          toast.success("Clips ready", {
            description: `"${f.filename}" — extracted ${f.clipsCount} clip${f.clipsCount === 1 ? "" : "s"}.`,
            duration: 6000,
          });
        }
        continue;
      }

      if (f.status === "failed") {
        toast.error("Processing failed", {
          description: `"${f.filename}" could not be processed. You can retry with a new upload or contact support if this keeps happening.`,
          duration: 9000,
        });
        continue;
      }

      if (f.status === "no credits") {
        toast.error("Not enough credits", {
          description:
            `"${f.filename}" was not processed. Add credits under Billing and upload again.`,
          duration: 8000,
        });
        continue;
      }

      if (f.status === "cancelled") {
        toast.info("Processing cancelled", {
          description: `"${f.filename}" was cancelled. You can re-upload to try again.`,
          duration: 6000,
        });
      }
    }
  }, [uploadedFiles]);

  useEffect(() => {
    if (!hasActiveJobs) return;

    const id = window.setInterval(() => {
      router.refresh();
    }, 4500);

    return () => window.clearInterval(id);
  }, [hasActiveJobs, router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const file = files[0]!;
    setUploading(true);

    try {
      const { success, signedUrl, uploadedFileId } = await generateUploadUrl({
        filename: file.name,
        contentType: file.type,
        prompt: prompt.trim() || undefined,
      });

      if (!success) throw new Error("Failed to get upload URL");

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok)
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);

      await processVideo(uploadedFileId);

      setFiles([]);
      setPrompt("");

      toast.success("Upload received", {
        description:
          "Processing has started — we’ll notify you here when clips are ready or if something goes wrong.",
        duration: 5000,
      });
      router.refresh();
    } catch {
      toast.error("Upload failed", {
        description:
          "There was a problem uploading your video. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-sans pb-20 pt-24 border-t border-white/5">
      <div className="mx-auto flex max-w-[1000px] flex-col space-y-10 px-6">

        {/* ── DEV FAILURE MODE BANNER ─────────────────────────────────── */}
        {isMockFailureMode && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/30 px-5 py-4 text-sm backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <span className="relative flex size-5 mt-0.5 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400/50 opacity-75" />
              <TriangleAlert className="relative size-5 text-red-400" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-red-300 mb-0.5">⚠ Failure Simulation Mode is ON</p>
              <p className="text-red-200/70 text-xs leading-relaxed">
                Every upload will instantly fail — this is intentional. To disable, set{" "}
                <code className="font-mono bg-red-900/50 px-1.5 py-0.5 rounded text-red-200">MOCK_FAILURE=&quot;false&quot;</code>{" "}
                in your <code className="font-mono bg-red-900/50 px-1.5 py-0.5 rounded text-red-200">.env</code> file.
              </p>
            </div>
          </div>
        )}
        {/* ────────────────────────────────────────────────────────────── */}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
              Podcast Clipper
            </h1>
            <p className="text-zinc-400 mt-2 text-sm max-w-lg">
              Upload your raw podcast audio or video and let our pipeline extract the best moments instantly.
            </p>
          </div>
          <Link href="/dashboard/billing">
            <Button className="rounded-md bg-white text-black hover:bg-zinc-200 font-medium px-5 h-9 text-xs">
              Buy Credits
            </Button>
          </Link>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="flex items-center w-full justify-start border-b border-white/10 bg-transparent p-0 rounded-none h-auto mb-8 space-x-6">
            <TabsTrigger 
              value="upload" 
              className="px-1 pb-3 pt-2 font-medium text-sm text-zinc-500 border-b-2 border-transparent rounded-none data-[state=active]:border-white data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent bg-transparent transition-all outline-none"
            >
              Upload Media
            </TabsTrigger>
            <TabsTrigger 
              value="my-clips" 
              className="px-1 pb-3 pt-2 font-medium text-sm text-zinc-500 border-b-2 border-transparent rounded-none data-[state=active]:border-white data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent bg-transparent transition-all outline-none"
            >
              My Clips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-0 outline-none space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Upload Area */}
            <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">New Extraction</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  MP4 up to 500MB. Processing usually takes 2–5 minutes. Add an
                  optional brief below to steer what gets cut.
                </p>
              </div>
              
              <Dropzone
                onDrop={handleDrop}
                accept={{ "video/mp4": [".mp4"] }}
                maxSize={500 * 1024 * 1024}
                disabled={uploading}
                maxFiles={1}
              >
                {() => (
                  <div className="w-full flex flex-col items-center justify-center bg-transparent transition-colors py-16 text-center cursor-pointer group">
                    <UploadCloud className="text-zinc-500 h-8 w-8 mb-4 group-hover:text-zinc-300 transition-colors" />
                    <p className="font-medium text-sm text-white mb-1">Click to browse or drag file here</p>
                    <p className="text-xs text-zinc-500 mb-6 w-full max-w-xs text-balance">MP4 tracking enabled. Automatically slices and filters highlights.</p>
                    
                    {files.length === 0 && (
                      <div className="px-5 py-2 rounded-md bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-colors shadow-sm">
                        Select File
                      </div>
                    )}
                    {files.length > 0 && (
                      <div className="px-5 py-2.5 rounded-md bg-white/10 border border-white/20 text-white text-xs font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="truncate max-w-[200px]">{files[0]?.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>

              {/* Extraction brief — always visible, aligned with upload card */}
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/35 p-5 sm:p-6">
                <div className="flex gap-4">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/[0.08]"
                    aria-hidden
                  >
                    <Sparkles className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Extraction brief
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                        Say what kinds of moments you want (topics, tone, or
                        format). Leave it empty and we&apos;ll pick highlights
                        automatically.
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                        Quick starters
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {EXTRACTION_BRIEF_IDEAS.map((idea) => (
                          <button
                            key={idea}
                            type="button"
                            disabled={uploading}
                            onClick={() => setPrompt(idea)}
                            className={cn(
                              "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-left text-[11px] font-medium text-zinc-300",
                              "transition-colors hover:border-primary/35 hover:bg-primary/[0.07] hover:text-white",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]",
                              "disabled:pointer-events-none disabled:opacity-50",
                            )}
                          >
                            {idea}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="extraction-brief"
                        className="sr-only"
                      >
                        Your extraction brief
                      </label>
                      <textarea
                        id="extraction-brief"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Example: Pull clips where they argue about remote work, keep them under 45 seconds of continuous talk."
                        rows={3}
                        maxLength={500}
                        disabled={uploading}
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-zinc-600 focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-colors disabled:opacity-50"
                      />
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-[11px] text-zinc-600">
                          Optional. Shorter, specific briefs usually work best.
                        </p>
                        <span
                          className={cn(
                            "shrink-0 text-[11px] tabular-nums",
                            prompt.length > 450
                              ? "text-amber-400"
                              : "text-zinc-600",
                          )}
                        >
                          {prompt.length}/500
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end border-t border-white/10 pt-6">
                <Button
                  disabled={files.length === 0 || uploading}
                  onClick={handleUpload}
                  className="rounded-md h-10 px-8 text-sm font-semibold bg-primary text-black hover:bg-primary/90 disabled:opacity-50 disabled:bg-white/10 disabled:text-zinc-400 flex items-center gap-2 transition-all shadow-md"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Uploading Media...
                    </>
                  ) : (
                    "Upload and Process File"
                  )}
                </Button>
              </div>
            </div>

            {/* Queue Table */}
            {uploadedFiles.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-[#0c0c0c] flex flex-col overflow-hidden shadow-xl shadow-black/40">
                <div className="p-6 border-b border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold flex items-center gap-2 text-white">
                      <ListVideo className="w-4 h-4 text-zinc-400" />
                      Recent uploads
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-xl">
                      {hasActiveJobs
                        ? "Status updates automatically while jobs run (about 2–5 minutes)."
                        : "Latest processing jobs on your account."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasActiveJobs && (
                      <span className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/50 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                        </span>
                        Live updates
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="h-9 text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                    >
                      {refreshing ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      ) : null}
                      Refresh now
                    </Button>
                  </div>
                </div>

                {uploadedFiles.some((f) => f.status === "failed") && (
                  <div
                    role="status"
                    className="mx-6 mt-4 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-100"
                  >
                    <p className="font-medium flex items-center gap-2">
                      <AlertCircle className="size-4 shrink-0 text-red-400" />
                      One or more uploads failed during processing.
                    </p>
                    <p className="mt-1 text-xs text-red-200/85 pl-6">
                      Check the Failed row below. Your file is saved; upload again or use a shorter MP4 if the error persists.
                    </p>
                  </div>
                )}

                <div className="overflow-x-auto p-2 pb-5">
                  <Table className="w-full text-sm">
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="font-medium text-zinc-500 h-11 px-6">
                          File
                        </TableHead>
                        <TableHead className="font-medium text-zinc-500 h-11 px-6 w-[148px]">
                          Date
                        </TableHead>
                        <TableHead className="font-medium text-zinc-500 h-11 px-6 min-w-[150px]">
                          Status
                        </TableHead>
                        <TableHead className="font-medium text-zinc-500 h-11 px-6 w-[116px] text-right">
                          Clips
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedFiles.map((item) => (
                        <TableRow
                          key={item.id}
                          className={cn(
                            "border-white/[0.06] transition-colors hover:bg-white/[0.03]",
                            item.status === "processing" &&
                              "bg-amber-500/[0.04]",
                          )}
                        >
                          <TableCell className="font-medium text-zinc-100 px-6 py-4 max-w-[280px]">
                            <span className="line-clamp-2" title={item.filename}>
                              {item.filename}
                            </span>
                          </TableCell>
                          <TableCell className="text-zinc-500 px-6 py-4 text-xs tabular-nums whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 align-middle">
                            {statusBadge(item)}
                          </TableCell>
                          <TableCell className="text-right px-6 py-4 align-middle">
                            {item.clipsCount > 0 ? (
                              <Badge
                                variant="secondary"
                                className="rounded-full border border-white/10 bg-white/[0.08] text-white font-medium tabular-nums"
                              >
                                {item.clipsCount}
                              </Badge>
                            ) : (
                              <span className="text-zinc-600 text-xs tabular-nums">
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-clips" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="rounded-xl border border-white/10 bg-[#0c0c0c] p-6 sm:p-8 min-h-[50vh]">
              <div className="mb-8">
                <h2 className="text-lg font-medium text-white">My clips</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Source videos are grouped. Tap a row to expand or collapse
                  clips. Briefs apply to the whole upload.
                </p>
              </div>
              <ClipDisplay clips={clips} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
