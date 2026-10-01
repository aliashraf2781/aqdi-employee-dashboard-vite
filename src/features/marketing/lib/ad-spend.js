const DEFAULT_CAMPAIGN_ID = 'manual';
const DEFAULT_CAMPAIGN_NAME = 'إدخال يدوي';
const CURRENCY = 'SAR';

/** One row of the ad-spend import endpoint, built from the manual entry form. */
export function buildAdSpendRow(values) {
  const campaignName = values.campaign_name.trim();

  return {
    spent_on: values.spent_on,
    platform: values.platform,
    campaign_id: campaignName || DEFAULT_CAMPAIGN_ID,
    campaign_name: campaignName || DEFAULT_CAMPAIGN_NAME,
    spend: Number(values.spend),
    currency: CURRENCY,
    impressions: Number(values.impressions) || 0,
    clicks: Number(values.clicks) || 0,
  };
}
