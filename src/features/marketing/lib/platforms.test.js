import { describe, expect, it } from 'vitest';
import { buildSyncOutcome } from './platforms';

describe('buildSyncOutcome', () => {
  it('reports the synced row count', () => {
    expect(buildSyncOutcome({ google: { synced: 3 }, meta: { synced: 2 } })).toEqual({
      type: 'success',
      message: 'تمت مزامنة 5 صف من صرف الإعلانات',
    });
  });

  it('lists platforms that are not configured', () => {
    const outcome = buildSyncOutcome({ google: { skipped: true }, tiktok: { skipped: true } });
    expect(outcome.type).toBe('info');
    expect(outcome.description).toBe('بحاجة إلى إعداد: قوقل، تيك توك');
  });

  it('handles an empty result', () => {
    expect(buildSyncOutcome(null).message).toBe('اكتملت المزامنة — لا جديد');
  });
});
