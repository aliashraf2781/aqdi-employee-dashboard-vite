import { RotateCw } from 'lucide-react';
import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';
import { PLATFORM_LABELS_AR } from '@/features/marketing/lib/platforms';

const FALLBACK_ACCOUNTS = Object.keys(PLATFORM_LABELS_AR).map((platform) => ({ platform, configured: false }));

/** Which ad accounts feed the numbers, plus the "sync now" button (only for users who may create). */
export function AdAccountsBar({ accounts, canSync, isSyncing, onSync }) {
  const list = accounts.length ? accounts : FALLBACK_ACCOUNTS;

  return (
    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-muted-foreground">تُزامَن تلقائيًا من:</span>
        {list.map((account) => (
          <Badge key={account.platform} tone={account.configured ? 'success' : 'neutral'} className="gap-1.5">
            <span className={cn('size-1.5 rounded-full', account.configured ? 'bg-success' : 'bg-neutral')} />
            {account.label || PLATFORM_LABELS_AR[account.platform] || account.platform}
          </Badge>
        ))}
      </div>
      {canSync && (
        <Button size="sm" onClick={() => onSync()} disabled={isSyncing}>
          <RotateCw className={cn('size-3.5', isSyncing && 'animate-spin')} />
          {isSyncing ? 'جارٍ المزامنة…' : 'مزامنة الآن'}
        </Button>
      )}
    </div>
  );
}
