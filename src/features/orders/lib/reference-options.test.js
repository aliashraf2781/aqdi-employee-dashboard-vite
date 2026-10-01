import { describe, expect, it } from 'vitest';
import {
  extractTenantRoles,
  getReferenceLabel,
  mapCitiesToOptions,
  mapReferenceToOptions,
  normalizeListResponse,
} from './reference-options';

describe('reference options', () => {
  it('finds the list in any response shape', () => {
    expect(normalizeListResponse({ data: { items: [1] } })).toEqual([1]);
    expect(normalizeListResponse({ data: [2] })).toEqual([2]);
    expect(normalizeListResponse([3])).toEqual([3]);
    expect(normalizeListResponse({})).toEqual([]);
  });

  it('prefers the translated name', () => {
    expect(getReferenceLabel({ id: 1, name_trans: 'a', name: 'b' })).toBe('a');
    expect(getReferenceLabel({ id: 9 })).toBe('9');
  });

  it('maps items to options and skips items without id', () => {
    expect(mapReferenceToOptions([{ id: 1, name: 'x' }, { name: 'y' }])).toEqual([{ value: '1', label: 'x' }]);
  });

  it('keeps the region of a city', () => {
    expect(mapCitiesToOptions([{ id: 2, name: 'c', region_id: 5 }])[0]).toEqual({ value: '2', label: 'c', regionId: '5' });
  });

  it('reads tenant roles', () => {
    expect(extractTenantRoles({ data: { data: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
  });
});
