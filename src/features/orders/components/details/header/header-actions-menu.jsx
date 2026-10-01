import { Bell, ChevronDown, Copy, Loader2, MessageSquareText, Printer } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/components/dropdown-menu';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { printOrderContract } from '../../../lib/contract-print';
import { getOrderSmsTemplates } from '../../../lib/order-sms-templates';
import { getSendErrorTitle, SECTION_ERROR_CONTEXTS } from '../../../lib/send-error-message';

/** "إجراءات" menu: print, SMS, copy payment link, message templates and "send an error to the client". */
export function HeaderActionsMenu({ orderData, orderUuid, isCopyingPayLink, onCopyPayLink, onSms, onSendSectionError }) {
  const templates = getOrderSmsTemplates(orderUuid);

  const print = () => {
    if (!orderData) {
      toast.error('لا توجد بيانات للطباعة');
      return;
    }
    if (!printOrderContract(orderData)) toast.error('تعذر فتح نافذة الطباعة');
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-xs font-bold">
          إجراءات
          <ChevronDown className="size-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72">
        <DropdownMenuItem onSelect={print}>
          <Printer className="size-4 text-muted-foreground" />
          طباعة
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onSms} disabled={!orderData}>
          <MessageSquareText className="size-4 text-muted-foreground" />
          رسالة SMS
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onCopyPayLink} disabled={!orderUuid || isCopyingPayLink}>
          {isCopyingPayLink ? <Loader2 className="size-4 animate-spin" /> : <Copy className="size-4 text-muted-foreground" />}
          نسخ رابط الدفع
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="px-3 py-1.5 text-xs font-bold text-muted-foreground">قوالب الرسائل</DropdownMenuLabel>
        {templates.map((template) => (
          <DropdownMenuItem key={template.id} onSelect={() => copyToClipboard(template.body, `تم نسخ قالب: ${template.label}`)}>
            <Copy className="size-3.5 text-muted-foreground" />
            {template.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Bell className="size-4 text-muted-foreground" />
            إرسال خطأ للعميل
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            {SECTION_ERROR_CONTEXTS.map((context) => (
              <DropdownMenuItem key={context} onSelect={() => onSendSectionError(context)}>
                {getSendErrorTitle(context)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
