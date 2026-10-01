import { beforeEach, describe, expect, it } from 'vitest';
import { clearRelatedContractOrigin, getRelatedContractOriginId, syncRelatedContractOrigin } from './related-contract-origin';

const order = (id, ids) => ({ id, user_contracts: ids.map((contractId) => ({ id: contractId })) });

describe('related contract origin', () => {
  beforeEach(() => clearRelatedContractOrigin());

  it('does nothing without related contracts', () => {
    expect(syncRelatedContractOrigin({ id: 1 })).toBeNull();
    expect(getRelatedContractOriginId()).toBeNull();
  });

  it('remembers the first contract opened as the origin', () => {
    expect(syncRelatedContractOrigin(order(1, [1, 2, 3]))).toBe('1');
    expect(syncRelatedContractOrigin(order(2, [1, 2, 3]))).toBe('1');
    expect(getRelatedContractOriginId()).toBe('1');
  });

  it('starts a new group when the contract is not in the remembered one', () => {
    syncRelatedContractOrigin(order(1, [1, 2]));
    expect(syncRelatedContractOrigin(order(9, [8, 9]))).toBe('9');
  });

  it('can be cleared', () => {
    syncRelatedContractOrigin(order(1, [1, 2]));
    clearRelatedContractOrigin();
    expect(getRelatedContractOriginId()).toBeNull();
  });
});
