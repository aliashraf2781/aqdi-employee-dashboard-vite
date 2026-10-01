/** Ad platform keys used by the API, with their Arabic names. */
export const PLATFORM_LABELS_AR = {
  google: 'قوقل',
  meta: 'ميتا',
  tiktok: 'تيك توك',
  snapchat: 'سناب',
  twitter: 'إكس',
};

export const PLATFORM_OPTIONS = Object.entries(PLATFORM_LABELS_AR).map(([value, label]) => ({ value, label }));

/**
 * Toast text after "sync ad spend". `results` is `{ [platform]: { synced, skipped } }`.
 * Returns `{ type: 'success' | 'info', message, description? }`.
 */
export function buildSyncOutcome(results) {
  const entries = Object.entries(results || {});
  const synced = entries.reduce((sum, [, result]) => sum + (result?.synced || 0), 0);
  const notConfigured = entries.filter(([, result]) => result?.skipped).map(([platform]) => PLATFORM_LABELS_AR[platform] || platform);

  if (synced > 0) return { type: 'success', message: `تمت مزامنة ${synced} صف من صرف الإعلانات` };
  if (notConfigured.length > 0) {
    return { type: 'info', message: 'لا توجد حسابات إعلانية مُهيّأة', description: `بحاجة إلى إعداد: ${notConfigured.join('، ')}` };
  }
  return { type: 'success', message: 'اكتملت المزامنة — لا جديد' };
}
