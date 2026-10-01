const DEFAULT_MEDIUM = 'cpc';

const UTM_PARAM_BY_FIELD = {
  source: 'utm_source',
  medium: 'utm_medium',
  campaign: 'utm_campaign',
  term: 'utm_term',
  content: 'utm_content',
};

/** Starting values of the UTM builder, taken from the server's example url and source list. */
export function buildUtmSeed(example, sources = []) {
  const base = { url: '', source: sources[0]?.source || '', medium: DEFAULT_MEDIUM, campaign: '', content: '', term: '' };
  if (!example) return base;

  try {
    const parsed = new URL(example);
    return {
      ...base,
      url: `${parsed.origin}${parsed.pathname}`,
      source: parsed.searchParams.get('utm_source') || base.source,
      medium: parsed.searchParams.get('utm_medium') || DEFAULT_MEDIUM,
    };
  } catch {
    return base;
  }
}

/** The page url with the filled UTM fields appended; empty when there is no url. */
export function buildTaggedUrl(values) {
  if (!values.url) return '';

  const params = new URLSearchParams();
  Object.entries(UTM_PARAM_BY_FIELD).forEach(([field, param]) => {
    if (values[field]) params.set(param, values[field]);
  });

  const query = params.toString();
  return query ? `${values.url}?${query}` : values.url;
}
