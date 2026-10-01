import { describe, expect, it } from 'vitest';
import { resolveListFilters, toggleFilterPill } from './orders-filters';

describe('toggleFilterPill', () => {
  it('turns a pill on and off', () => {
    expect(toggleFilterPill([], 'authenticated')).toEqual(['authenticated']);
    expect(toggleFilterPill(['authenticated'], 'authenticated')).toEqual([]);
  });

  it('keeps completion pills exclusive', () => {
    expect(toggleFilterPill(['authenticated'], 'incomplete')).toEqual(['incomplete']);
  });

  it('keeps status pills exclusive but independent of completion', () => {
    expect(toggleFilterPill(['canceled', 'authenticated'], 'returned')).toEqual(['authenticated', 'returned']);
  });
});

describe('resolveListFilters', () => {
  const ids = { canceledStatusId: 4, returnedStatusId: 2 };

  it('maps pills to api filters', () => {
    expect(resolveListFilters({ activeFilters: ['authenticated', 'canceled'], extraStatusId: null, ...ids })).toEqual({
      isCompleted: 1,
      statusId: 4,
    });
    expect(resolveListFilters({ activeFilters: ['incomplete', 'returned'], extraStatusId: null, ...ids })).toEqual({
      isCompleted: 0,
      statusId: 2,
    });
  });

  it('prefers an extra status over the status pills', () => {
    expect(resolveListFilters({ activeFilters: ['canceled'], extraStatusId: 9, ...ids }).statusId).toBe(9);
  });

  it('sends nothing when no filter is active', () => {
    expect(resolveListFilters({ activeFilters: [], extraStatusId: null, ...ids })).toEqual({
      isCompleted: undefined,
      statusId: undefined,
    });
  });
});
