import { describe, expect, it } from 'vitest';
import { buildClientProperties } from './client-properties';

describe('buildClientProperties', () => {
  it('uses the units nested inside an estate', () => {
    const user = { real_estates: [{ id: 1, name_real_estate: 'برج', units: [{ id: 10, unit_number: '5' }] }] };

    const { properties, totals } = buildClientProperties(user);

    expect(properties).toHaveLength(1);
    expect(properties[0].title).toBe('برج');
    expect(properties[0].units[0]).toMatchObject({ id: 10, number: '5' });
    expect(totals).toEqual({ properties: 1, units: 0 });
  });

  it('links flat units to their estate by id', () => {
    const user = { real_estates: [{ id: 1 }], units: [{ id: 10, real_estate_id: 1 }] };

    expect(buildClientProperties(user).properties[0].units).toHaveLength(1);
  });

  it('collects units without an estate into one extra card', () => {
    const user = { real_estates: [{ id: 1 }], units: [{ id: 10, real_estate_id: 99 }] };

    const { properties } = buildClientProperties(user);

    expect(properties.map((property) => property.id)).toEqual([1, 'unassigned']);
  });

  it('reads the older *_list keys and survives a missing user', () => {
    expect(buildClientProperties({ real_estates_list: [{ id: 2 }] }).totals.properties).toBe(1);
    expect(buildClientProperties(undefined)).toEqual({ properties: [], totals: { properties: 0, units: 0 } });
  });
});
