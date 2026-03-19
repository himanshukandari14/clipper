"use client";

import Dropzone from "shadcn-dropzone";
import type { Clip } from "@prisma/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Loader2, UploadCloud, CheckCircle2, ListVideo } from "lucide-react";
import { useState } from "react";
import { generateUploadUrl } from "~/actions/s3";
import { toast } from "sonner";
import { processVideo } from "~/actions/generation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useRouter } from "next/navigation";
import { ClipDisplay } from "./clip-display";

export function DashboardClient({
  uploadedFiles,
  clips,
}: {
  uploadedFiles: {
    id: string;
    s3Key: string;
    filename: string;
    status: string;
    clipsCount: number;
    createdAt: Date;
  }[];
  clips: Clip[];
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

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
        throw new Error(`Upload filed with status: ${uploadResponse.status}`);

      await processVideo(uploadedFileId);

      setFiles([]);

      toast.success("Video uploaded successfully", {
        description:
          "Your video has been scheduled for processing. Check the status below.",
        duration: 5000,
      });
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
                <p className="text-sm text-zinc-500 mt-1">Accepts MP4 files up to 500MB. Processing takes approximately 2-5 minutes.</p>
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
              <div className="rounded-xl border border-white/10 bg-[#0c0c0c] flex flex-col">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium flex items-center gap-2">
                      <ListVideo className="w-4 h-4 text-zinc-400" /> 
                      Recent Uploads
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="h-8 text-xs font-medium text-zinc-400 hover:text-white"
                  >
                    {refreshing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                    Refresh
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <Table className="w-full text-sm">
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="font-medium text-zinc-500 h-10 px-6">File Name</TableHead>
                        <TableHead className="font-medium text-zinc-500 h-10 px-6 w-[150px]">Date</TableHead>
                        <TableHead className="font-medium text-zinc-500 h-10 px-6 w-[150px]">Status</TableHead>
                        <TableHead className="font-medium text-zinc-500 h-10 px-6 w-[120px] text-right">Extracted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedFiles.map((item) => (
                        <TableRow key={item.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                          <TableCell className="font-medium text-zinc-200 px-6 py-4">
                            {item.filename}
                          </TableCell>
                          <TableCell className="text-zinc-500 px-6 py-4 text-xs">
                            {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center">
                              {item.status === "queued" && (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" /> Queued
                                </span>
                              )}
                              {item.status === "processing" && (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-500">
                                  <Loader2 className="w-3 h-3 animate-spin" /> Processing
                                </span>
                              )}
                              {item.status === "processed" && (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Processed
                                </span>
                              )}
                              {item.status === "no credits" && (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Insufficient Credits
                                </span>
                              )}
                              {item.status === "failed" && (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Failed
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-6 py-4">
                            {item.clipsCount > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-white text-xs font-medium">
                                {item.clipsCount} {item.clipsCount !== 1 ? "Clips" : "Clip"}
                              </span>
                            ) : (
                              <span className="text-zinc-600 text-xs">
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
                <h2 className="text-lg font-medium text-white">Generated Arsenal</h2>
                <p className="text-sm text-zinc-500 mt-1">All your previously extracted shorts and clips.</p>
              </div>
              <ClipDisplay clips={clips} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
