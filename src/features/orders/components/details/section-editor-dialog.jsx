import { useState } from 'react';
import { Modal } from '@/shared/components/modal';
import { SectionEditorProvider } from './section-editor-context';

const SECTION_TITLES = {
  deed: 'الصك والملاك',
  address: 'تفاصيل العقار',
  tenant: 'العقد - المستأجر',
  financial: 'البيانات المالية - الشروط',
  units: 'تفاصيل الوحدات',
};

/**
 * Dialog around one section's editor form. `resetKey` changes each time it opens, so the forms
 * inside start again from the saved order.
 */
export function SectionEditorDialog({ open, onOpenChange, section, children }) {
  const [openCount, setOpenCount] = useState(0);
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setOpenCount((count) => count + 1);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="lg" title={SECTION_TITLES[section] || 'تعديل البيانات'}>
      <SectionEditorProvider onClose={() => onOpenChange(false)} resetKey={openCount}>
        {open && children}
      </SectionEditorProvider>
    </Modal>
  );
}
