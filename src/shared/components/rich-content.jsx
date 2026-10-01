import '@/styles/rich-content.css';
import { cn } from '@/shared/lib/cn';

/** Shows HTML produced by RichTextEditor. The HTML comes from our own admin editor. */
export function RichContent({ html, className }) {
  return <div className={cn('rich-content', className)} dangerouslySetInnerHTML={{ __html: html || '' }} />;
}
