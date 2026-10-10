import type { DateRange } from '@/types';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** `'2022-04'` → `'Apr 2022'`. Falls back to the raw value if it is not a month. */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  if (!year || !MONTHS[index]) return value;
  return `${MONTHS[index]} ${year}`;
}

/** The year alone, for when months would be noise. */
export function formatYear(value: string): string {
  return value.split('-')[0] ?? value;
}

/**
 * Renders a range as `Apr 2022 — Jul 2022`, or `Aug 2022 — Present` when open.
 * Pass `{ month: false }` for compact year-only labels.
 */
export function formatRange(range: DateRange, options: { month?: boolean } = {}): string {
  const { month = true } = options;
  const render = month ? formatMonth : formatYear;
  return `${render(range.start)} - ${range.end ? render(range.end) : 'Present'}`;
}
