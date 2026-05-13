"use client";

import type { Clip, UploadedFile } from "@prisma/client";
import {
  ChevronRight,
  Download,
  Loader2,
  Play,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getClipPlayUrl } from "~/actions/generation";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "~/lib/utils";

type UploadedFileSnippet = Pick<
  UploadedFile,
  "id" | "displayName" | "prompt" | "createdAt"
>;

export type ClipWithSource = Clip & {
  uploadedFile: UploadedFileSnippet | null;
};

type ClipGroup = {
  key: string;
  videoLabel: string;
  videoDate: Date | null;
  prompt: string | null;
  clips: ClipWithSource[];
};

function groupClipsBySource(clips: ClipWithSource[]): ClipGroup[] {
  const map = new Map<string, ClipWithSource[]>();
  for (const clip of clips) {
    const fileId = clip.uploadedFileId ?? `_orphan_${clip.id}`;
    const list = map.get(fileId);
    if (list) list.push(clip);
    else map.set(fileId, [clip]);
  }

  const groups: ClipGroup[] = [];
  for (const [key, groupClips] of map) {
    const first = groupClips[0];
    const uf = first?.uploadedFile;
    groups.push({
      key,
      videoLabel: uf?.displayName ?? "Unknown source",
      videoDate: uf?.createdAt ?? first?.createdAt ?? null,
      prompt: uf?.prompt ?? null,
      clips: groupClips.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    });
  }

  groups.sort((a, b) => {
    const ta = a.videoDate ? new Date(a.videoDate).getTime() : 0;
    const tb = b.videoDate ? new Date(b.videoDate).getTime() : 0;
    return tb - ta;
  });

  return groups;
}

function ClipCard({ clip }: { clip: ClipWithSource }) {
  const [playUrl, setPlayUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);

  useEffect(() => {
    async function fetchPlayUrl() {
      try {
        const result = await getClipPlayUrl(clip.id);
        if (result.succes && result.url) {
          setPlayUrl(result.url);
        } else if (result.error) {
          console.error("Failed to get play url: " + result.error);
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingUrl(false);
      }
    }

    void fetchPlayUrl();
  }, [clip.id]);

  const handleDownload = () => {
    if (playUrl) {
      const link = document.createElement("a");
      link.href = playUrl;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-white/[0.07] bg-black/30 p-2",
        "transition-colors hover:border-white/12",
      )}
    >
      <div className="relative aspect-[9/16] max-h-[220px] w-full overflow-hidden rounded-md bg-zinc-900/90">
        {isLoadingUrl ? (
          <div className="flex h-full min-h-[140px] w-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-600" />
          </div>
        ) : playUrl ? (
          <video
            src={playUrl}
            controls
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[140px] w-full items-center justify-center">
            <Play className="h-8 w-8 text-zinc-600 opacity-50" />
          </div>
        )}
      </div>
      <Button
        onClick={handleDownload}
        variant="outline"
        size="sm"
        className="mt-2 h-8 border-white/12 bg-transparent text-[11px] text-zinc-300 hover:bg-white/[0.06] hover:text-white"
        disabled={!playUrl}
      >
        <Download className="mr-1 h-3 w-3" />
        Download
      </Button>
    </div>
  );
}

function ClipGroupBlock({
  group,
  defaultOpen,
}: {
  group: ClipGroup;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const dateStr = group.videoDate
    ? new Date(group.videoDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const hasBrief = Boolean(group.prompt?.trim());

  return (
    <div className="rounded-lg border border-white/[0.07] bg-[#0a0a0a] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors",
          "hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset",
        )}
      >
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-zinc-500 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
            <span
              className="truncate text-sm font-medium text-white"
              title={group.videoLabel}
            >
              {group.videoLabel}
            </span>
            <Badge
              variant="secondary"
              className="h-5 shrink-0 border-0 bg-white/[0.08] px-2 text-[10px] font-medium tabular-nums text-zinc-300"
            >
              {group.clips.length} clip{group.clips.length === 1 ? "" : "s"}
            </Badge>
            {dateStr ? (
              <span className="shrink-0 text-[11px] tabular-nums text-zinc-600">
                {dateStr}
              </span>
            ) : null}
            {hasBrief ? (
              <span className="flex items-center gap-0.5 text-[10px] font-medium text-primary/90">
                <Sparkles className="size-3" />
                Brief
              </span>
            ) : (
              <span className="text-[10px] text-zinc-600">Auto</span>
            )}
          </div>
          {!open && hasBrief ? (
            <p
              className="mt-1 line-clamp-1 pl-0 text-[11px] text-zinc-600"
              title={group.prompt ?? undefined}
            >
              {group.prompt?.trim()}
            </p>
          ) : null}
        </div>
      </button>

      {open ? (
        <div className="border-t border-white/[0.06] px-3 pb-3 pt-2">
          {hasBrief ? (
            <p
              className="mb-3 text-[11px] leading-relaxed text-zinc-500"
              title={group.prompt ?? undefined}
            >
              <span className="font-medium text-zinc-400">Brief: </span>
              {group.prompt?.trim()}
            </p>
          ) : (
            <p className="mb-3 text-[11px] text-zinc-600">
              No custom brief — automatic highlight detection.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {group.clips.map((clip) => (
              <ClipCard key={clip.id} clip={clip} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ClipDisplay({ clips }: { clips: ClipWithSource[] }) {
  const groups = useMemo(() => groupClipsBySource(clips), [clips]);

  if (clips.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-black/30 px-6 py-12 text-center text-sm text-zinc-500">
        No clips yet. Upload a video on the first tab to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {groups.map((group, index) => (
        <ClipGroupBlock
          key={group.key}
          group={group}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
