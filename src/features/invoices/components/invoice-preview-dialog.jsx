import { Printer } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';
import { TextField } from '@/shared/components/ui/text-field';
import { printElement } from '@/shared/lib/print-element';
import { InvoiceSheet } from './invoice-sheet';

/** Shows one invoice and lets the employee add the customer's name before printing. */
export function InvoicePreviewDialog({ invoice, onClose }) {
  const sheetRef = useRef(null);
  // Typed names are kept per invoice, so reopening another invoice starts from its own name.
  const [typedNames, setTypedNames] = useState({});

  if (!invoice) return null;

  const customerName = (typedNames[invoice.id] ?? invoice.customerName ?? '').trim();

  const handlePrint = () => {
    if (!printElement(sheetRef.current)) toast.error('تعذر فتح نافذة الطباعة');
  };

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title="الفاتورة"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="size-4" />
            طباعة الفاتورة
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField
          label="اسم العميل (يظهر بالفاتورة عند الطباعة – اختياري)"
          value={typedNames[invoice.id] ?? invoice.customerName ?? ''}
          onChange={(event) => setTypedNames((names) => ({ ...names, [invoice.id]: event.target.value }))}
        />
        <InvoiceSheet ref={sheetRef} invoice={invoice} customerName={customerName} />
      </div>
    </Modal>
  );
}
