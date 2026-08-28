"use client";

import { useState } from "react";

interface CopyAccountButtonProps {
  accountNumber: string;
  copyLabel: string;
  copiedLabel: string;
}

export default function CopyAccountButton({
  accountNumber,
  copyLabel,
  copiedLabel,
}: CopyAccountButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 py-2 text-xs font-semibold text-zinc-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-800 dark:hover:text-emerald-400"
    >
      <span aria-hidden>{copied ? "✓" : "⧉"}</span>
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
