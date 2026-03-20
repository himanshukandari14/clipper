"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black p-8 text-white">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-center text-zinc-400">
        {error.message || "A server error occurred. Check your Vercel logs for digest: "}
        {error.digest && <code className="block mt-2 text-primary">{error.digest}</code>}
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
