import { Badge } from '@/shared/components/badge';
import { cn } from '@/shared/lib/cn';
import { DASH, formatRoas } from '@/features/marketing/lib/format';
import { getCompetitionTone, getPublishTone, getRankTone, getRoasTone, getSeverityTone } from '@/features/marketing/lib/status-tones';
import { SEVERITY_LABELS } from '@/features/marketing/lib/seo-crawl';

/** Channel colour token sent by the API -> theme token classes. */
const COLOR_CLASSES = {
  blue: 'bg-accent text-accent-foreground',
  purple: 'bg-secondary/10 text-secondary',
  black: 'bg-foreground/10 text-foreground',
  yellow: 'bg-warning-soft text-warning',
  gray: 'bg-neutral-soft text-neutral',
};

export function ColorChip({ label, color, className }) {
  return <Badge className={cn(COLOR_CLASSES[color] ?? COLOR_CLASSES.gray, className)}>{label}</Badge>;
}

/** ROAS pill; the colour comes from the API's `roas_tone`, nothing is recomputed here. */
export function RoasChip({ value, tone }) {
  return <Badge tone={getRoasTone(tone)}>{formatRoas(value)}</Badge>;
}

export function RankChip({ rank, tone }) {
  if (rank == null) return <span className="text-muted-foreground">{DASH}</span>;
  return <Badge tone={getRankTone(tone)}>{rank}</Badge>;
}

const KEYWORD_STATUS = {
  increased: { className: 'text-success', icon: '▲' },
  decreased: { className: 'text-danger', icon: '▼' },
  stable: { className: 'text-muted-foreground', icon: '▬' },
};

export function KeywordStatus({ status, label }) {
  const { className, icon } = KEYWORD_STATUS[status] ?? KEYWORD_STATUS.stable;
  return (
    <span className={cn('text-xs font-bold', className)}>
      {icon} {label || status || DASH}
    </span>
  );
}

/** Green up-arrow when >= 0, red down-arrow when negative. */
export function ChangeBadge({ value }) {
  if (value == null || value === '' || Number.isNaN(Number(value))) return null;
  const isUp = Number(value) >= 0;
  return (
    <span className={cn('text-xs font-bold', isUp ? 'text-success' : 'text-danger')}>
      {isUp ? '▲' : '▼'} {Math.abs(Number(value))}%
    </span>
  );
}

export function SeverityBadge({ severity }) {
  return <Badge tone={getSeverityTone(severity)}>{SEVERITY_LABELS[severity] || severity}</Badge>;
}

export function CompetitionBadge({ competition, label }) {
  if (!competition) return DASH;
  return <Badge tone={getCompetitionTone(competition)}>{label || competition}</Badge>;
}

const SCHEDULED_CLASS = 'bg-accent text-accent-foreground';

/** Publish state of an article / service page. Pass the Arabic label when the API sends one. */
export function PublishStatusBadge({ status }) {
  const tone = getPublishTone(status);
  if (tone === 'primary') return <Badge className={SCHEDULED_CLASS}>{status}</Badge>;
  return <Badge tone={tone}>{status}</Badge>;
}
