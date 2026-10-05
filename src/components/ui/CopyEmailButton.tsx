'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyEmailButton({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the address is visible either way.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={className}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Copied' : 'Copy address'}
    </button>
  );
}
