import { describe, expect, it } from 'vitest';
import { getAudienceSections, getMessagesByType, parseCustomerMessagesAll, toSelectOptions } from './customer-messages';

describe('customer messages helpers', () => {
  it('parses the envelope', () => {
    expect(parseCustomerMessagesAll({ data: { audiences: [1], messages: [2] } })).toEqual({ audiences: [1], messages: [2] });
    expect(parseCustomerMessagesAll(undefined)).toEqual({ audiences: [], messages: [] });
  });

  it('filters messages and sections by type', () => {
    expect(getMessagesByType([{ type: 'client' }, { type: 'employee' }], 'client')).toHaveLength(1);
    expect(getAudienceSections([{ type: 'client', sections: [{ id: 1 }] }], 'client')).toEqual([{ id: 1 }]);
    expect(getAudienceSections([], 'client')).toEqual([]);
  });

  it('builds select options with a name fallback', () => {
    expect(toSelectOptions([{ id: 1, name_ar: 'أ' }, { id: 2, name_en: 'b' }, { id: 3 }])).toEqual([
      { value: '1', label: 'أ' },
      { value: '2', label: 'b' },
      { value: '3', label: '—' },
    ]);
  });
});
