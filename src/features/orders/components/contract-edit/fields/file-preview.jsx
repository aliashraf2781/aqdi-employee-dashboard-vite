import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isPdfMediaUrl, resolveMediaUrl } from '../../../lib/media-url';

function Thumbnail({ imageUrl }) {
  if (imageUrl) return <img src={imageUrl} alt="" className="size-14 rounded-xl border border-border object-cover" />;
  return (
    <span className="flex size-14 items-center justify-center rounded-xl border border-border bg-muted">
      <FileText className="size-5 text-danger" />
    </span>
  );
}

/** Thumbnail of a File picked by the user (local object URL, revoked when replaced). */
function PickedFilePreview({ file }) {
  const isImage = Boolean(file.type?.startsWith('image/'));
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!isImage) return undefined;
    const url = URL.createObjectURL(file);
    // An object URL is an external resource: it is created and revoked in the same effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [isImage, file]);

  // Only trust a URL made for the current file; older ones are already revoked.
  const imageUrl = isImage && preview?.file === file ? preview.url : null;

  return (
    <div className="flex items-center gap-3">
      <Thumbnail imageUrl={imageUrl} />
      <p className="min-w-0 flex-1 truncate text-xs font-bold text-muted-foreground">{file.name}</p>
    </div>
  );
}

/** What the order already has for a file field (a new File picked by the user, or the saved file link). */
export function FilePreview({ value }) {
  if (typeof File !== 'undefined' && value instanceof File) return <PickedFilePreview file={value} />;

  const url = resolveMediaUrl(value);
  if (!url) return null;

  return (
    <div className="flex items-center gap-3">
      <Thumbnail imageUrl={isPdfMediaUrl(url) ? null : url} />
      <a href={url} target="_blank" rel="noopener noreferrer" dir="ltr" className="min-w-0 flex-1 truncate text-xs text-muted-foreground hover:text-primary">
        {url}
      </a>
    </div>
  );
}
