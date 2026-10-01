import { describe, expect, it } from 'vitest';
import { cardValue, summarizeEmployees } from './employee-kpis';

const items = [
  {
    cards: [
      { key: 'received', value: 3 },
      { key: 'completed', value: 2 },
    ],
    avg_receive: { value: 4 },
    revenue: { value: 100 },
  },
  { cards: [{ key: 'received', value: 1 }], avg_receive: { value: 6 }, revenue: { value: 50 } },
];

describe('employee kpis', () => {
  it('reads a card value with a zero default', () => {
    expect(cardValue(items[0], 'received')).toBe(3);
    expect(cardValue(items[1], 'completed')).toBe(0);
  });

  it('adds up rows when there is no server summary', () => {
    expect(summarizeEmployees(items)).toMatchObject({
      count: 2,
      received: 4,
      completed: 2,
      revenue: 150,
      avgReceiveMinutes: 5,
    });
  });

  it('prefers the server summary', () => {
    expect(summarizeEmployees(items, { received_total: 99 }).received).toBe(99);
  });
});
