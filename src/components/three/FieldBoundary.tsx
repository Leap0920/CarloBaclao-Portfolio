'use client';

import { Component, type ReactNode } from 'react';

/**
 * A machine with WebGL disabled makes `<Canvas>` throw during render, and a
 * dynamic import does not catch that. On failure the field simply renders
 * nothing and the CSS lattice behind it is the hero's graphic — which is
 * already the design's first-paint state, so nothing looks broken.
 */
export class FieldBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[HeroField] WebGL unavailable, falling back to the CSS poster', error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
