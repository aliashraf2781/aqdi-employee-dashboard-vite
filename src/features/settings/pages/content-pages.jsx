import { ContentPageScreen } from '@/features/settings/components/content-page-screen';

export const TermsPage = () => (
  <ContentPageScreen
    title="الشروط والأحكام"
    subtitle="تحرير وتحديث محتوى الشروط والأحكام"
    endpoint="/admin/content/terms-and-conditions"
    queryKey="terms-and-conditions"
  />
);

export const PrivacyPage = () => (
  <ContentPageScreen
    title="سياسة الخصوصية"
    subtitle="تحرير وتحديث محتوى سياسة الخصوصية"
    endpoint="/admin/content/privacy"
    queryKey="privacy-policy"
  />
);
