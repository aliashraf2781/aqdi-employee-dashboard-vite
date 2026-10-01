import { describe, expect, it } from 'vitest';
import { isFieldEmpty, isFieldVisible } from './field-visibility';

describe('isFieldEmpty', () => {
  it('treats blank values as empty but not zero', () => {
    expect(isFieldEmpty(null)).toBe(true);
    expect(isFieldEmpty('  ')).toBe(true);
    expect(isFieldEmpty([])).toBe(true);
    expect(isFieldEmpty(0)).toBe(false);
    expect(isFieldEmpty('a')).toBe(false);
  });
});

describe('isFieldVisible', () => {
  it('filters by tenant entity', () => {
    expect(isFieldVisible({ entity: 'institution' }, { tenant_entity: 'person' })).toBe(false);
    expect(isFieldVisible({ entity: 'institution' }, { tenant_entity: 'institution' })).toBe(true);
    expect(isFieldVisible({ entity: 'person' }, { tenant_entity: 'institution' })).toBe(false);
    expect(isFieldVisible({ entity: 'person' }, {})).toBe(true);
  });

  it('matches showWhen with yes/no equivalents', () => {
    const field = { showWhen: { add_legal_agent_of_owner: 1 } };
    expect(isFieldVisible(field, { add_legal_agent_of_owner: '1' })).toBe(true);
    expect(isFieldVisible(field, { add_legal_agent_of_owner: 0 })).toBe(false);
    expect(isFieldVisible({ showWhen: { mode: ['a', 'b'] } }, { mode: 'b' })).toBe(true);
  });
});
