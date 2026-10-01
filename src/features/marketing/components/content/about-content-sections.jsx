import { ContentPageSections } from '@/features/marketing/components/content/content-page-sections';
import { ABOUT_PAGE } from '@/features/marketing/schemas/about-sections';

export function AboutContentSections() {
  return <ContentPageSections page={ABOUT_PAGE} />;
}
