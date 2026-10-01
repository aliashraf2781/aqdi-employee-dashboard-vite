import { describe, expect, it } from 'vitest';
import { buildClientsQueryParams, buildExportQueryParams, statusFilterToParams } from './clients-query';

describe('buildClientsQueryParams', () => {
  it('omits empty and "all" filters', () => {
    expect(buildClientsQueryParams({ page: 1, perPage: 25, platform: 'all', createdAt: 'all', search: '' })).toEqual({
      page: 1,
      per_page: 25,
    });
  });

  it('caps the page size at 100', () => {
    expect(buildClientsQueryParams({ perPage: 500 }).per_page).toBe(100);
  });

  it('keeps is_active=0 because it is a real filter value', () => {
    expect(buildClientsQueryParams({ isActive: 0 }).is_active).toBe(0);
  });

  it('sends banned only when it is switched on', () => {
    expect(buildClientsQueryParams({ banned: 1 }).banned).toBe(1);
    expect(buildClientsQueryParams({ banned: 0 })).not.toHaveProperty('banned');
  });
});

describe('buildExportQueryParams', () => {
  it('drops pagination but keeps filters', () => {
    expect(buildExportQueryParams({ page: 3, perPage: 50, search: 'علي' })).toEqual({ search: 'علي' });
  });
});

describe('statusFilterToParams', () => {
  it('maps each dropdown value to its API filter', () => {
    expect(statusFilterToParams('active')).toEqual({ isActive: 1 });
    expect(statusFilterToParams('inactive')).toEqual({ isActive: 0 });
    expect(statusFilterToParams('banned')).toEqual({ banned: 1 });
    expect(statusFilterToParams('all')).toEqual({});
  });
});
