import { useState } from 'react';
import { CrawlView } from '@/features/marketing/components/seo/crawl-view';
import { KeywordsView } from '@/features/marketing/components/seo/keywords-view';
import { PillButtons } from '@/features/marketing/components/shared/pill-buttons';

const VIEWS = [
  { value: 'keywords', label: 'الكلمات المفتاحية' },
  { value: 'crawl', label: 'فحص الموقع (الزحف)' },
];

export function SeoTab() {
  const [view, setView] = useState('keywords');

  return (
    <div>
      <div className="mb-4">
        <PillButtons options={VIEWS} value={view} onChange={setView} label="قسم السيو" />
      </div>
      {view === 'keywords' ? <KeywordsView /> : <CrawlView />}
    </div>
  );
}
