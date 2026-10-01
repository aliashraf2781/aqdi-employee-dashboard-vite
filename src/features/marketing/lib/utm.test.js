import { describe, expect, it } from 'vitest';
import { buildTaggedUrl, buildUtmSeed } from './utm';

describe('buildUtmSeed', () => {
  it('uses the first source when there is no example', () => {
    expect(buildUtmSeed(null, [{ source: 'google' }])).toMatchObject({ url: '', source: 'google', medium: 'cpc' });
  });

  it('reads url, source and medium from the example', () => {
    const seed = buildUtmSeed('https://aqdi.sa/page?utm_source=meta&utm_medium=social', []);
    expect(seed).toMatchObject({ url: 'https://aqdi.sa/page', source: 'meta', medium: 'social' });
  });

  it('survives a broken example url', () => {
    expect(buildUtmSeed('not a url', []).url).toBe('');
  });
});

describe('buildTaggedUrl', () => {
  it('is empty without a url', () => {
    expect(buildTaggedUrl({ url: '', source: 'google' })).toBe('');
  });

  it('appends only the filled fields', () => {
    expect(buildTaggedUrl({ url: 'https://aqdi.sa', source: 'google', medium: 'cpc', campaign: '', term: '', content: 'ad_a' })).toBe(
      'https://aqdi.sa?utm_source=google&utm_medium=cpc&utm_content=ad_a',
    );
  });

  it('returns the bare url when nothing is filled', () => {
    expect(buildTaggedUrl({ url: 'https://aqdi.sa' })).toBe('https://aqdi.sa');
  });
});
