import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/ui/button';
import { useConnectGoogleSeo, useGoogleSeoStatus } from '@/features/marketing/hooks/use-marketing-integrations';

function describeState({ isLoading, unavailable }) {
  if (isLoading) return 'جارٍ التحقق من حالة الربط…';
  if (unavailable) {
    return 'ميزة الربط غير مُفعّلة على الخادم بعد (بانتظار تهيئة Google OAuth). ترتيب الكلمات وأكثر الصفحات زيارة ستبقى فارغة حتى يتم الربط.';
  }
  return 'غير مربوط. اربط الحساب لجلب ترتيب الكلمات المفتاحية وأكثر الصفحات زيارة.';
}

/** Search Console connection: shows the state and starts the Google OAuth flow. */
export function GoogleConnectionCard({ canConnect }) {
  const { status, connected, isLoading, unavailable, refetch } = useGoogleSeoStatus();
  const connect = useConnectGoogleSeo();

  const handleConnect = () => {
    connect.mutate(undefined, {
      onSuccess: (data) => {
        if (!data?.auth_url) {
          toast.error('لم يصل رابط الربط من الخادم');
          return;
        }
        window.open(data.auth_url, '_blank', 'noopener,noreferrer');
        toast.success('افتح نافذة Google لإكمال الربط ثم عد لتحديث الحالة');
      },
      onError: (error) => toast.error(getErrorMessage(error, 'تعذّر بدء ربط Google — تحقق من إعداد الخادم')),
    });
  };

  if (connected) {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Badge tone="success">
          Google Search Console مربوط{status?.site_url ? ` — ${status.site_url}` : ''}
        </Badge>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          تحديث الحالة
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border border-border bg-accent p-4">
      <div className="text-sm font-bold text-accent-foreground">ربط Google Search Console</div>
      <p className="mt-1 text-sm text-muted-foreground">{describeState({ isLoading, unavailable })}</p>
      {canConnect && !unavailable && (
        <Button size="sm" className="mt-3" onClick={handleConnect} disabled={connect.isPending}>
          {connect.isPending ? 'جارٍ التحضير…' : 'ربط الحساب ←'}
        </Button>
      )}
    </div>
  );
}
