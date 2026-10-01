import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { downloadMedia, fileNameFromMediaUrl } from '../lib/media-url';

/** Download button state: `download(url, name)` saves the file and tells the user how it went. */
export function useDownloadMedia() {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback(async (url, name) => {
    if (!url) return;
    setIsDownloading(true);
    try {
      const ok = await downloadMedia(url, name || fileNameFromMediaUrl(url));
      if (ok) toast.success('تم التحميل بنجاح');
      else toast.error('تعذر تحميل الملف');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { download, isDownloading };
}
