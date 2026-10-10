import { describe, expect, it } from 'vitest';
import { formatMonth, formatRange, formatYear } from '@/lib/format';

describe('formatMonth', () => {
  it('renders a YYYY-MM value as a short month and year', () => {
    expect(formatMonth('2022-04')).toBe('Apr 2022');
    expect(formatMonth('2024-12')).toBe('Dec 2024');
  });

  it('pads nothing and accepts a single-digit month', () => {
    expect(formatMonth('2023-01')).toBe('Jan 2023');
  });

  it('falls back to the raw value when it is not a month', () => {
    expect(formatMonth('Present')).toBe('Present');
    expect(formatMonth('2022')).toBe('2022');
    expect(formatMonth('2022-13')).toBe('2022-13');
    expect(formatMonth('')).toBe('');
  });
});

describe('formatYear', () => {
  it('takes the year alone', () => {
    expect(formatYear('2022-04')).toBe('2022');
  });

  it('falls back to the raw value when there is no separator', () => {
    expect(formatYear('Present')).toBe('Present');
  });
});

describe('formatRange', () => {
  // NOTE: the docstring above formatRange claims an em dash, but the
  // implementation emits a plain hyphen. These assertions pin the code as
  // written; if the separator is meant to be an em dash, change both.
  it('renders a closed range with the current separator', () => {
    expect(formatRange({ start: '2022-04', end: '2022-07' })).toBe('Apr 2022 - Jul 2022');
  });

  it('renders an open range as Present', () => {
    expect(formatRange({ start: '2022-08' })).toBe('Aug 2022 - Present');
  });

  it('drops the month when asked for a compact label', () => {
    expect(formatRange({ start: '2021-03', end: '2023-09' }, { month: false })).toBe('2021 - 2023');
  });
});
