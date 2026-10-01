import { RotateCw } from 'lucide-react';
import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/ui/button';
import { QueryState } from '@/shared/components/query-state';
import { cn } from '@/shared/lib/cn';
import { SectionCard } from '@/features/marketing/components/shared/section-card';

function AccountCard({ account, canManage, isSyncing, onSync }) {
  const { configured } = account;

  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', !configured && 'opacity-80')}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <span className={cn('size-2 rounded-full', configured ? 'bg-success' : 'bg-neutral')} />
          {account.label || account.platform}
        </div>
        <Badge tone={configured ? 'success' : 'neutral'}>{configured ? 'مربوط' : 'غير مُهيّأ'}</Badge>
      </div>
      <div dir="ltr" className="mt-2 text-start text-xs text-muted-foreground">
        utm_source: {account.utm_source || account.platform}
      </div>
      {!configured && account.missing?.length > 0 && (
        <p dir="ltr" className="mt-2 text-start text-xs text-warning">
          مفقود: {account.missing.join(', ')}
        </p>
      )}
      {canManage && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          disabled={isSyncing || !configured}
          title={!configured ? 'الحساب غير مُهيّأ على الخادم' : undefined}
          onClick={() => onSync(account.platform)}
        >
          مزامنة هذا الحساب
        </Button>
      )}
    </div>
  );
}

/** Ad accounts as reported by the UTM template endpoint, each with its own sync button. */
export function AdAccountCards({ utm, canManage, isSyncing, onSync }) {
  const syncAllButton = canManage && (
    <Button variant="outline" size="sm" onClick={() => onSync()} disabled={isSyncing}>
      <RotateCw className={cn('size-3.5', isSyncing && 'animate-spin')} />
      {isSyncing ? 'جارٍ المزامنة…' : 'مزامنة الكل'}
    </Button>
  );

  return (
    <SectionCard title="الحسابات الإعلانية ومزامنة الصرف" action={syncAllButton} className="mt-4">
      <QueryState
        isLoading={utm.isLoading}
        error={utm.error}
        isEmpty={utm.accounts.length === 0}
        emptyMessage="تعذّر تحميل حالة الحسابات الإعلانية."
        onRetry={utm.refetch}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {utm.accounts.map((account) => (
            <AccountCard key={account.platform} account={account} canManage={canManage} isSyncing={isSyncing} onSync={onSync} />
          ))}
        </div>
      </QueryState>
    </SectionCard>
  );
}
