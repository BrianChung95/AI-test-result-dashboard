"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1 text-xs text-white/70"
    >
      <Copy size={14} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
