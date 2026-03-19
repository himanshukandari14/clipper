import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20 pt-24 border-t border-white/5">
      <div className="mx-auto flex max-w-[1000px] flex-col space-y-10 px-6">
        
        {/* Header Section Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-white/5 rounded-md animate-pulse" />
            <div className="h-4 w-96 max-w-full bg-white/[0.03] rounded-md animate-pulse" />
          </div>
          <div className="h-9 w-28 bg-white/10 rounded-md animate-pulse hidden md:block" />
        </div>

        {/* Main Content Tabs Skeleton */}
        <div className="w-full">
          <div className="flex items-center w-full justify-start border-b border-white/10 p-0 h-auto mb-8 space-x-6">
            <div className="h-6 w-24 bg-white/10 rounded-sm pb-3 mb-3 animate-pulse" />
            <div className="h-6 w-20 bg-white/5 rounded-sm pb-3 mb-3 animate-pulse" />
          </div>

          <div className="space-y-8">
            {/* Upload Area Skeleton */}
            <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8">
              <div className="mb-6 space-y-3">
                <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse" />
                <div className="h-4 w-80 max-w-full bg-white/[0.03] rounded-md animate-pulse" />
              </div>
              
              <div className="w-full h-64 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#111111] animate-pulse p-16 text-center">
                <Loader2 className="h-8 w-8 text-white/10 animate-spin mb-4" />
                <div className="h-3 w-48 bg-white/5 rounded-md mb-2" />
              </div>

              <div className="mt-8 flex items-center justify-end border-t border-white/10 pt-6">
                <div className="h-10 w-48 bg-white/5 rounded-md animate-pulse hidden sm:block" />
              </div>
            </div>
            
            {/* Queue Table Skeleton */}
            <div className="rounded-xl border border-white/10 bg-[#0c0c0c] flex flex-col">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="h-5 w-32 bg-white/5 rounded-md animate-pulse" />
                <div className="h-8 w-20 bg-white/5 rounded-md animate-pulse" />
              </div>
              <div className="p-6 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-1/4 bg-white/5 rounded-md animate-pulse" />
                    <div className="h-4 w-1/6 bg-white/5 rounded-md animate-pulse" />
                    <div className="h-4 w-1/5 bg-white/5 rounded-md animate-pulse" />
                    <div className="h-4 w-12 bg-white/5 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
