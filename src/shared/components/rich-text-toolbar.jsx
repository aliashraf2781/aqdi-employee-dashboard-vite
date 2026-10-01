import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';

function ToolbarButton({ label, icon: Icon, active = false, disabled = false, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40',
        active && 'bg-accent text-accent-foreground',
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}

function askForLink(editor) {
  const previous = editor.getAttributes('link').href || '';
  const url = window.prompt('الرابط', previous);
  if (url === null) return;
  if (url === '') editor.chain().focus().unsetLink().run();
  else editor.chain().focus().setLink({ href: url }).run();
}

/** Buttons for the most common formatting actions. */
export function RichTextToolbar({ editor }) {
  const chain = () => editor.chain().focus();

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-muted p-2">
      <ToolbarButton label="غامق" icon={Bold} active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()} />
      <ToolbarButton label="مائل" icon={Italic} active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()} />
      <ToolbarButton label="تسطير" icon={Underline} active={editor.isActive('underline')} onClick={() => chain().toggleUnderline().run()} />
      <ToolbarButton label="يتوسطه خط" icon={Strikethrough} active={editor.isActive('strike')} onClick={() => chain().toggleStrike().run()} />
      <ToolbarButton label="عنوان" icon={Heading2} active={editor.isActive('heading', { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
      <ToolbarButton label="قائمة نقطية" icon={List} active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()} />
      <ToolbarButton label="قائمة رقمية" icon={ListOrdered} active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()} />
      <ToolbarButton label="اقتباس" icon={Quote} active={editor.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()} />
      <ToolbarButton label="محاذاة لليمين" icon={AlignRight} active={editor.isActive({ textAlign: 'right' })} onClick={() => chain().setTextAlign('right').run()} />
      <ToolbarButton label="توسيط" icon={AlignCenter} active={editor.isActive({ textAlign: 'center' })} onClick={() => chain().setTextAlign('center').run()} />
      <ToolbarButton label="محاذاة لليسار" icon={AlignLeft} active={editor.isActive({ textAlign: 'left' })} onClick={() => chain().setTextAlign('left').run()} />
      <ToolbarButton label="إضافة رابط" icon={Link2} active={editor.isActive('link')} onClick={() => askForLink(editor)} />
      <ToolbarButton label="إزالة الرابط" icon={Link2Off} disabled={!editor.isActive('link')} onClick={() => chain().unsetLink().run()} />
      <ToolbarButton label="تراجع" icon={Undo2} disabled={!editor.can().undo()} onClick={() => chain().undo().run()} />
      <ToolbarButton label="إعادة" icon={Redo2} disabled={!editor.can().redo()} onClick={() => chain().redo().run()} />
    </div>
  );
}
