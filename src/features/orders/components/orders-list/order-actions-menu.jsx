import { Copy, Loader2, MoreVertical, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/dropdown-menu';
import { IconButton } from '@/shared/components/icon-button';
import whatsappIcon from '@/assets/orders/whatsapp.svg';
import { usePrintOrder } from '../../hooks/use-print-order';
import { normalizeWhatsAppPhone } from '../../lib/order-contact';

/** "More" menu of a table row: copy the order number, open WhatsApp, print the contract. */
export function OrderActionsMenu({ order }) {
  const { isPrinting, printOrder } = usePrintOrder();

  const openWhatsApp = () => {
    const phone = normalizeWhatsAppPhone(order?.user_mobile);
    if (!phone) {
      toast.error('لا يوجد رقم جوال للعميل');
      return;
    }
    window.open(`https://wa.me/${phone}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <IconButton label="المزيد" className="size-8 rounded-lg">
          <MoreVertical className="size-4" />
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <DropdownMenuItem onSelect={() => copyToClipboard(order?.uuid, 'تم نسخ رقم الطلب')}>
          <Copy className="size-4 text-muted-foreground" />
          نسخ رقم الطلب
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={openWhatsApp}>
          <img src={whatsappIcon} alt="" className="size-4" />
          تواصل واتساب مع العميل
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isPrinting}
          onSelect={(event) => {
            event.preventDefault();
            printOrder(order?.id);
          }}
        >
          {isPrinting ? <Loader2 className="size-4 animate-spin" /> : <Printer className="size-4 text-muted-foreground" />}
          طباعة الطلب
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
