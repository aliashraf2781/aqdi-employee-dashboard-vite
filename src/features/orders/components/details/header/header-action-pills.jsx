import { BadgeCheck, Link2, Paperclip, Send, Undo2, Upload, ZoomIn } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { getVisibleHeaderActions, hasPropertyUpdate, HEADER_ACTIONS, isDocumentedStatus } from '../../../lib/order-header-rules';

const ACTION_PILLS = {
  [HEADER_ACTIONS.VIEW_FILE]: { label: 'عرض مكبّر', Icon: ZoomIn, className: 'border-border text-muted-foreground hover:bg-muted' },
  [HEADER_ACTIONS.PROPERTY_UPDATE]: { label: 'رفع تحديث العقار', Icon: Upload, className: 'border-info text-info hover:bg-info-soft' },
  [HEADER_ACTIONS.SEND_DRAFT]: { label: 'إرسال المسودة', Icon: Send, className: 'border-warning text-warning hover:bg-warning-soft' },
  [HEADER_ACTIONS.MISSING_ATTACHMENT]: { label: 'طلب مرفق ناقص', Icon: Paperclip, className: 'border-danger text-danger hover:bg-danger-soft' },
  [HEADER_ACTIONS.REFUND]: { label: 'رفع طلب استرجاع', Icon: Undo2, className: 'border-refunded text-refunded hover:bg-refunded-soft' },
  [HEADER_ACTIONS.EJAR_DOCUMENTATION]: { label: 'موثق في إيجار', Icon: BadgeCheck, className: 'border-success text-success hover:bg-success-soft' },
  [HEADER_ACTIONS.PAY_LINK]: { label: 'توليد رابط دفع', Icon: Link2, className: 'border-primary text-primary hover:bg-accent' },
};

/** Some actions change their wording once they were done (documented / property updated). */
function resolveLabel(action, view) {
  if (action === HEADER_ACTIONS.EJAR_DOCUMENTATION && isDocumentedStatus({ name: view.status_name })) return 'تعديل توثيق ايجار';
  if (action === HEADER_ACTIONS.PROPERTY_UPDATE && hasPropertyUpdate(view)) return 'تعديل تحديث العقار';
  return ACTION_PILLS[action].label;
}

/** The row of action buttons under the header. `handlers` maps an action id to its click handler. */
export function HeaderActionPills({ view, orderData, handlers }) {
  return (
    <div className="flex flex-wrap gap-2 border-t border-border pt-3">
      {getVisibleHeaderActions(view, orderData).map((action) => {
        const { Icon, className } = ACTION_PILLS[action];
        return (
          <button
            key={action}
            type="button"
            onClick={handlers[action]}
            className={cn('inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-lg border bg-surface px-3.5 text-xs font-semibold transition-colors', className)}
          >
            <Icon className="size-3.5 shrink-0" />
            {resolveLabel(action, view)}
          </button>
        );
      })}
    </div>
  );
}
