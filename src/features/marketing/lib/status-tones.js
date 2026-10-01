/** Maps API status values (English keys or Arabic labels) to Badge tones. */

const PUBLISH_TONES = {
  published: 'success',
  منشور: 'success',
  draft: 'warning',
  مسودة: 'warning',
  scheduled: 'primary',
  مجدول: 'primary',
  مجدولة: 'primary',
  archived: 'neutral',
  مؤرشف: 'neutral',
  'غير مجدول': 'neutral',
};

const SEVERITY_TONES = { high: 'danger', medium: 'warning', low: 'neutral' };
const ROAS_TONES = { good: 'success', ok: 'warning', bad: 'danger', muted: 'neutral' };
const RANK_TONES = { good: 'success', warn: 'warning', muted: 'neutral' };
const COMPETITION_TONES = { high: 'danger', medium: 'warning', low: 'success' };

export const getPublishTone = (status) => PUBLISH_TONES[status] ?? 'neutral';
export const getSeverityTone = (severity) => SEVERITY_TONES[severity] ?? 'neutral';
export const getRoasTone = (tone) => ROAS_TONES[tone] ?? 'neutral';
export const getRankTone = (tone) => RANK_TONES[tone] ?? 'neutral';
export const getCompetitionTone = (competition) => COMPETITION_TONES[competition] ?? 'neutral';
