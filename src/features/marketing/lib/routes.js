export const MARKETING_PATH = '/home/marketing-and-content';

export const marketingTabPath = (tab) => `${MARKETING_PATH}?tab=${tab}`;

/** Detail page of one crawled url; `issueId` seeds the page data. */
export function websiteDetailsPath({ page, issueId }) {
  const params = new URLSearchParams({ page: page || '', issueId: String(issueId) });
  return `${MARKETING_PATH}/website-details?${params.toString()}`;
}
