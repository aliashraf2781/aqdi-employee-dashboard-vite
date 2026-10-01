import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '@/styles/rich-content.css';
import { RichTextToolbar } from '@/shared/components/rich-text-toolbar';

/**
 * TipTap based HTML editor.
 * `initialContent` is read once: to load different content, remount the editor with a new `key`.
 * `onChange` receives the HTML string.
 */
export function RichTextEditor({ initialContent = '', onChange, placeholder = 'اكتب هنا...', label }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialContent,
    onUpdate: ({ editor: current }) => onChange?.(current.getHTML()),
    editorProps: {
      attributes: { 'aria-label': label || 'محرر النص', class: 'rich-content min-h-48 p-4 focus:outline-none' },
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-md border border-input bg-surface">
      <RichTextToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
