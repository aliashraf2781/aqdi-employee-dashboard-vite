import { describe, expect, it } from 'vitest';
import { buildCsv } from './csv';

describe('buildCsv', () => {
  it('quotes every cell and escapes inner quotes', () => {
    const csv = buildCsv([
      ['اسم', 'a "b"'],
      [1, null],
    ]);
    expect(csv).toBe('﻿"اسم","a ""b"""\n"1",""');
  });
});
