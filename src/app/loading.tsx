'use client';

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Loader2 className="w-12 h-12 text-blue-500 dark:text-white animate-spin" />
    </div>
  );
}
