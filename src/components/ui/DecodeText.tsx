'use client';

import { Fragment, useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The decode.
 *
 * The name does not fade in - it locks in. Every letter starts as a
 * random terminal glyph and resolves left to right, like a signal being
 * acquired, so the largest piece of type on the page performs the one
 * gesture the whole theme is built on. It replays on hover, which makes
 * the name the only interactive piece of type on the site.
 *
 * Three properties make this safe to put on an <h1>:
 *
 * 1. IT CANNOT SHIFT THE LAYOUT. The display face is a monospace, so
 *    every glyph in `GLYPHS` has the same advance width as the character
 *    it replaces. Swapping them is a repaint and nothing else - no
 *    reflow, no reflow-driven CLS, and the caret beside the name never
 *    moves. This is the reason the effect is a glyph swap and not a
 *    typewriter: typing changes the length of the line every frame, and
 *    a line that grows is a line that reflows.
 * 2. IT IS NOT WHAT A SCREEN READER HEARS. The letters are `aria-hidden`
 *    and the caller labels the heading with the real name, so assistive
 *    tech gets "Carlo Baclao" and never a stream of random glyphs. The
 *    server-rendered markup is the finished name too, so the effect is
 *    invisible to crawlers and to anyone whose bundle never arrives.
 * 3. IT IS OFF UNDER `prefers-reduced-motion`. The effect returns before
 *    it touches the DOM, and the letters keep the name they were
 *    rendered with.
 *
 * Words are wrapped in `white-space: nowrap` spans. Per-letter spans
 * would otherwise let the line break between any two letters, which
 * turns the name into a ragged stack on a narrow phone.
 */

export type DecodeWord = {
  text: string;
  /** Styling for this word only - the surname carries the italic. */
  className?: string;
};

/** Uppercase, digits and symbols: every one is single-width in Space Mono. */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*+=<>/';

/** Quiet beat before the decode starts, so the page paints first. */
const START_MS = 150;
/** Offset between one letter locking and the next. */
const STAGGER_MS = 45;
/** How long a single letter keeps churning. */
const LETTER_MS = 380;
/** Glyph swap interval. Much faster than this reads as a blur, not a decode. */
const SWAP_MS = 50;

export function DecodeText({ words, className }: { words: DecodeWord[]; className?: string }) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const playedRef = useRef(false);

  const run = useCallback(() => {
    const root = rootRef.current;
    if (!root || runningRef.current) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>('[data-decode]'));
    if (!letters.length) return;

    const targets = letters.map((el) => el.dataset.char ?? '');
    const total = START_MS + (letters.length - 1) * STAGGER_MS + LETTER_MS;

    runningRef.current = true;
    root.dataset.decoding = 'true';

    const settle = (el: HTMLElement, i: number) => {
      if (el.textContent !== targets[i]) el.textContent = targets[i];
      if (el.dataset.scrambling) delete el.dataset.scrambling;
    };

    let t0 = 0;
    let nextSwap = 0;

    const step = (now: number) => {
      if (!t0) t0 = now;
      const t = now - t0;

      // Swap on a fixed interval rather than every frame: at 60fps the
      // glyphs change too fast to read as characters at all.
      const swapping = now >= nextSwap;
      if (swapping) nextSwap = now + SWAP_MS;

      for (let i = 0; i < letters.length; i += 1) {
        const local = t - START_MS - i * STAGGER_MS;
        if (local >= LETTER_MS) {
          settle(letters[i], i);
          continue;
        }
        if (swapping) {
          letters[i].textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          letters[i].dataset.scrambling = '1';
        }
      }

      if (t < total) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      letters.forEach(settle);
      delete root.dataset.decoding;
      runningRef.current = false;
    };

    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (reduced || playedRef.current) return;
    playedRef.current = true;
    run();
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, run]);

  return (
    <span
      ref={rootRef}
      className={className}
      onPointerEnter={reduced ? undefined : run}
    >
      {words.map((word, wi) => (
        <Fragment key={`${word.text}-${wi}`}>
          {wi > 0 ? ' ' : null}
          <span className={word.className} style={{ whiteSpace: 'nowrap' }}>
            {Array.from(word.text).map((ch, ci) => (
              <span key={ci} data-decode data-char={ch} aria-hidden="true">
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
