const PICK_WEIGHT = 0.4;
const PROCESS_WEIGHT = 0.4;
const VOLUME_WEIGHT = 0.2;
const GOOD_SCORE = 80;
const OK_SCORE = 55;

export function findKpiCard(item, key) {
  return item?.cards?.find((card) => card.key === key);
}

/** Share of orders picked up inside the SLA, as a 0-100 number. */
function computePickPercent(item, received) {
  const total = item.receive_sla?.total;
  const within = item.receive_sla?.within;
  const samples = total ?? received;

  if (within != null && total != null && total > 0) return Math.round((within / total) * 100);
  if (item.receive_sla?.percent != null && samples > 0) return Math.round(item.receive_sla.percent);
  return samples > 0 ? 0 : 100;
}

function computeProcessPercent(item, openNow, late) {
  if (item.process_sla?.percent != null) return Math.round(item.process_sla.percent);
  if (openNow > 0) return Math.max(0, Math.min(100, Math.round((1 - late / openNow) * 100)));
  return 100;
}

/** Numbers shown on one employee performance card. */
export function computeEmployeePerfMetrics(item, maxCompleted) {
  const received = findKpiCard(item, 'received')?.value ?? 0;
  const openNow = findKpiCard(item, 'open_now')?.value ?? 0;
  const completed = findKpiCard(item, 'completed')?.value ?? 0;
  const late = findKpiCard(item, 'late_over_24h')?.value ?? 0;

  // No work in the period: empty SLAs must not read as 100% (that gave a fake score).
  const hasNoActivity = received === 0 && completed === 0 && openNow === 0;
  const pickPct = hasNoActivity ? 0 : computePickPercent(item, received);
  const procPct = hasNoActivity ? 0 : computeProcessPercent(item, openNow, late);
  const volPct = Math.round((completed / Math.max(1, maxCompleted ?? 0)) * 100);

  const calculatedScore = Math.round(pickPct * PICK_WEIGHT + procPct * PROCESS_WEIGHT + volPct * VOLUME_WEIGHT);
  const score = item.score ?? item.performance_score ?? (hasNoActivity ? 0 : calculatedScore);

  const avgPick = item.avg_receive?.value;
  const pickLabel =
    avgPick != null ? `سرعة الاستلام داخل الدوام — متوسط ${avgPick} د` : 'سرعة الاستلام داخل الدوام';

  return { received, openNow, completed, late, pickPct, procPct, volPct, score, pickLabel };
}

/** Which semantic color a 0-100 value should use. */
export function getPerfTone(percent) {
  const value = percent ?? 0;
  if (value >= GOOD_SCORE) return 'success';
  if (value >= OK_SCORE) return 'warning';
  return 'danger';
}
