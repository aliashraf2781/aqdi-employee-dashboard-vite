export const MARKETING_PATH = '/home/marketing-and-content';

export const marketingTabPath = (tab) => `${MARKETING_PATH}?tab=${tab}`;

/** Detail page of one crawled url; `issueId` seeds the page data. */
export function websiteDetailsPath({ page, issueId }) {
  const params = new URLSearchParams({ page: page || '', issueId: String(issueId) });
  return `${MARKETING_PATH}/website-details?${params.toString()}`;
}

const LEGACY_CONTENT_VIEWS = ['home', 'about', 'images'];

/**
 * The old `/home/content?tab=home|about|images` page now lives in the marketing content tab.
 * Unknown or missing tabs open the home page editor.
 */
export function legacyContentRedirectPath(legacyTab) {
  const view = LEGACY_CONTENT_VIEWS.includes(legacyTab) ? legacyTab : LEGACY_CONTENT_VIEWS[0];
  return `${MARKETING_PATH}?tab=content&view=${encodeURIComponent(view)}`;
}
