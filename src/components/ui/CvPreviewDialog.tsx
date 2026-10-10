'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Download, ExternalLink, X as CloseIcon } from 'lucide-react';
import { profile } from '@/data/profile';
import { useMountTransition } from '@/hooks/useMountTransition';
import { cn } from '@/lib/cn';

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/** Keep in step with the `duration-200` on the panel below. */
const EXIT_MS = 200;

interface CvPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  /** The control that opened it. Focus returns here when it closes. */
  triggerRef?: RefObject<HTMLElement | null>;
}

/**
 * The CV as an in-page modal rather than a new tab.
 *
 * Rendered through a portal so no ancestor's transform or `overflow` can clip
 * it. It keeps the same contract as the project detail dialog: Escape closes
 * it, the backdrop closes it, focus lands on the close button and is trapped
 * inside, the page behind it cannot scroll, and focus returns to the trigger on
 * close.
 *
 * The iframe is the preview itself. Browsers that will not render a PDF inline
 * — most mobile ones — fall back to the "Open in new tab" link in the footer,
 * so the panel is never a blank dead end.
 */
export function CvPreviewDialog({ open, onClose, triggerRef }: CvPreviewDialogProps) {
  const { mounted, visible } = useMountTransition(open, EXIT_MS);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Fallback for when no trigger ref is supplied: whatever was focused.
  const lastFocused = useRef<HTMLElement | null>(null);

  // Hand focus back to the control that opened the dialog. This goes through
  // the ref rather than `document.activeElement`, because a click does not
  // focus a button in every browser (Safari), and focus must not land on body.
  useEffect(() => {
    if (open) {
      lastFocused.current = (triggerRef?.current ?? document.activeElement) as HTMLElement | null;
      return;
    }
    const target = triggerRef?.current ?? lastFocused.current;
    target?.focus?.({ preventScroll: true });
  }, [open, triggerRef]);

  // The page behind the dialog must not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  // Land focus inside, keep it inside, and close on Escape.
  useEffect(() => {
    if (!mounted) return;
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const node = dialogRef.current;
      if (!node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );

      if (items.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[120] flex items-center justify-center p-3 transition-opacity duration-200 ease-out motion-reduce:transition-none sm:p-6',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-background/95" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Curriculum vitae preview"
        tabIndex={-1}
        className={cn(
          'relative z-10 flex h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-card border border-border bg-surface shadow-2xl transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
          visible ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0',
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Curriculum vitae
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close CV preview"
            className="grid h-11 w-11 place-items-center rounded-full border border-border-strong bg-surface text-foreground transition-colors duration-200 ease-out hover:border-accent/60 hover:text-accent"
          >
            <CloseIcon size={18} aria-hidden="true" />
          </button>
        </div>

        <iframe
          src={profile.resumeUrl}
          title="Curriculum vitae"
          className="min-h-0 w-full flex-1 border-0 bg-surface-2"
        />

        <div className="flex flex-wrap gap-3 border-t border-border px-4 py-3">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-card rounded border border-border-strong bg-surface px-4 text-sm font-semibold text-foreground transition-colors duration-200 ease-out hover:border-accent/60 hover:text-accent"
          >
            <ExternalLink size={15} aria-hidden="true" />
            Open in new tab
          </a>
          <a
            href={profile.resumeUrl}
            download="Carlo_Baclao_Resume.pdf"
            className="inline-flex min-h-11 items-center gap-2 rounded-card rounded bg-accent px-4 text-sm font-semibold text-on-accent transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <Download size={15} aria-hidden="true" />
            Download CV
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
