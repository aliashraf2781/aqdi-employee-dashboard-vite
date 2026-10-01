import { Ban, ShieldCheck, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/page-loader';

export function ClientHeaderActions({ client, isBlocking, onBlock, onDelete, onDiscount }) {
  const BlockIcon = client.blocked ? ShieldCheck : Ban;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={onBlock} disabled={isBlocking} className={client.blocked ? 'text-primary' : 'text-destructive'}>
        {isBlocking ? <Spinner className="size-3.5" /> : <BlockIcon className="size-3.5" />}
        {client.blocked ? 'إلغاء حظر العميل' : 'حظر العميل'}
      </Button>
      <Button variant="outline" size="sm" onClick={onDiscount}>
        <Tag className="size-3.5" />
        خصم/إعفاء مخصص
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive">
        <Trash2 className="size-3.5" />
        حذف العميل
      </Button>
    </div>
  );
}
