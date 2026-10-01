import { describe, expect, it } from 'vitest';
import { buildSummaryCards, getNewOrdersTotal } from './new-requests-summary';

describe('getNewOrdersTotal', () => {
  it('prefers the summary, then the list total, then the loaded rows', () => {
    expect(getNewOrdersTotal({ summary: { total_new_orders: 9 }, totalCount: 5, orders: [] })).toBe(9);
    expect(getNewOrdersTotal({ summary: null, totalCount: 5, orders: [] })).toBe(5);
    expect(getNewOrdersTotal({ summary: null, totalCount: undefined, orders: [{}, {}] })).toBe(2);
  });
});

describe('buildSummaryCards', () => {
  it('uses the cards sent by the API', () => {
    const cards = [{ key: 'a', label: 'A', count: 1 }];
    expect(buildSummaryCards({ summary: { cards }, orders: [], total: 0 })).toBe(cards);
  });

  it('counts overdue orders from the loaded rows', () => {
    const orders = [{ waiting_minutes: 5 }, { waiting_minutes: 20 }, { waiting_minutes: 45 }];
    const cards = buildSummaryCards({ summary: null, orders, total: 3 });
    expect(cards.map((card) => card.count)).toEqual([3, 2, 1]);
  });

  it('prefers the counts of the API summary', () => {
    const cards = buildSummaryCards({ summary: { exceeded_15_minutes: 7, exceeded_30_minutes: 4 }, orders: [], total: 10 });
    expect(cards.map((card) => card.count)).toEqual([10, 7, 4]);
  });
});
