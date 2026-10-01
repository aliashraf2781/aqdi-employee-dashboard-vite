import { describe, expect, it } from 'vitest';
import {
  formatJoinedLabel,
  formatMoney,
  sortByJoinedDate,
  splitJoinedDateTime,
  whatsappHref,
} from './client-details-format';

describe('splitJoinedDateTime', () => {
  it('splits the API format into date and time', () => {
    expect(splitJoinedDateTime('2026-03-01 14:30')).toEqual({ date: '2026-03-01', time: '14:30' });
  });

  it('returns dashes for an empty value', () => {
    expect(splitJoinedDateTime(null)).toEqual({ time: '—', date: '—' });
  });
});

describe('formatJoinedLabel', () => {
  it('joins date and time with a dot', () => {
    expect(formatJoinedLabel('2026-03-01 14:30')).toBe('2026-03-01 · 14:30');
  });

  it('returns a dash when there is nothing to show', () => {
    expect(formatJoinedLabel('')).toBe('—');
  });
});

describe('sortByJoinedDate', () => {
  const rows = [
    { id: 1, joinedAt: '2026-01-01 10:00' },
    { id: 2, joinedAt: null },
    { id: 3, joinedAt: '2026-03-01 10:00' },
  ];

  it('puts the newest first when descending and keeps undated rows last', () => {
    expect(sortByJoinedDate(rows, 'desc').map((row) => row.id)).toEqual([3, 1, 2]);
  });

  it('puts the oldest first when ascending and keeps undated rows last', () => {
    expect(sortByJoinedDate(rows, 'asc').map((row) => row.id)).toEqual([1, 3, 2]);
  });
});

describe('whatsappHref', () => {
  it('replaces a leading zero with the Saudi country code', () => {
    expect(whatsappHref('0501234567')).toBe('https://wa.me/966501234567');
  });

  it('keeps a number that already has the country code', () => {
    expect(whatsappHref('+966 50 123 4567')).toBe('https://wa.me/966501234567');
  });

  it('returns null without digits', () => {
    expect(whatsappHref('—')).toBeNull();
  });
});

describe('formatMoney', () => {
  it('groups thousands and tolerates bad input', () => {
    expect(formatMoney(12345)).toBe('12,345');
    expect(formatMoney('abc')).toBe('0');
  });
});
