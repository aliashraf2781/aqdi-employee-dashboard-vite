import { describe, expect, it } from 'vitest';
import { buildRealtimeListParams, findSection, resolveStatusId } from './realtime-sections';

const statusIds = { received: 6, canceled: 4, returned: 2 };
const base = { page: 1, perPage: 25, search: '', statusIds, canViewReceivedQueue: true };

describe('resolveStatusId', () => {
  it('shows the received queue by default', () => {
    expect(resolveStatusId({ ...base })).toBe(6);
  });

  it('shows every status when the user cannot see the received queue', () => {
    expect(resolveStatusId({ ...base, canViewReceivedQueue: false })).toBeUndefined();
  });

  it('uses the canceled and returned statuses for their sections', () => {
    expect(resolveStatusId({ ...base, activeSection: 'canceled' })).toBe(4);
    expect(resolveStatusId({ ...base, activeSection: 'returned' })).toBe(2);
  });

  it('does not filter by status inside the completion sections', () => {
    expect(resolveStatusId({ ...base, activeSection: 'authenticated' })).toBeUndefined();
    expect(resolveStatusId({ ...base, activeSection: 'incomplete' })).toBeUndefined();
  });

  it('lets a chosen status chip win over a section', () => {
    expect(resolveStatusId({ ...base, activeSection: 'canceled', extraStatusId: 9 })).toBe(9);
  });
});

describe('buildRealtimeListParams', () => {
  it('asks for completed orders in the authenticated section', () => {
    const params = buildRealtimeListParams({ ...base, activeSection: 'authenticated' });
    expect(params.complete).toBe(1);
    expect(params.status_id).toBeUndefined();
  });

  it('asks for incomplete orders in the incomplete section', () => {
    expect(buildRealtimeListParams({ ...base, activeSection: 'incomplete' }).incomplete).toBe(1);
  });

  it('adds search, contract type and paging', () => {
    const params = buildRealtimeListParams({ ...base, search: 'abc', contractType: 'housing', page: 3 });
    expect(params).toMatchObject({ search: 'abc', contract_type: 'housing', page: 3, per_page: 25, status_id: 6 });
  });
});

describe('findSection', () => {
  it('returns the section with its title', () => {
    expect(findSection('authenticated').sectionTitle).toBe('موثق في إيجار');
    expect(findSection('nope')).toBeNull();
  });
});
