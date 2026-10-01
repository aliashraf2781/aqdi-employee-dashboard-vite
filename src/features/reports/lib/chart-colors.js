/**
 * Bar fills come from the chart-N color tokens (see styles/tokens.css).
 * Class names are written out in full so Tailwind can see them.
 */
export const CHART_BAR_CLASSES = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5', 'bg-chart-6'];

const NEGATIVE_BAR_CLASS = 'bg-danger';

export function chartBarClass(index, value = 0) {
  if (value < 0) return NEGATIVE_BAR_CLASS;
  return CHART_BAR_CLASSES[index % CHART_BAR_CLASSES.length];
}
