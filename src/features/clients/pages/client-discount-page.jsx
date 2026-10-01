import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { BackLink } from '@/shared/components/back-link';
import { Card } from '@/shared/components/card';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { PageHeader } from '@/shared/components/page-header';
import { PageLoader, Spinner } from '@/shared/components/page-loader';
import { ActiveDiscountBadge } from '@/features/clients/components/active-discount-badge';
import { DiscountForm } from '@/features/clients/components/discount-form';
import { DiscountHistoryTable } from '@/features/clients/components/discount-history-table';
import { DiscountImpactTable } from '@/features/clients/components/discount-impact-table';
import { useAssignClientCoupon } from '@/features/clients/hooks/use-assign-client-coupon';
import { useClientCoupons } from '@/features/clients/hooks/use-client-coupons';
import { useClientDetail } from '@/features/clients/hooks/use-client-detail';
import { useDeactivateClientCoupon } from '@/features/clients/hooks/use-deactivate-client-coupon';
import { DISCOUNT_TYPES, getDiscountPreviewRows } from '@/features/clients/lib/client-discount';
import { clientPath, resolveBackPath } from '@/features/clients/lib/client-paths';

const INITIAL_PREVIEW = { type: DISCOUNT_TYPES.PERCENTAGE, value: '', appliesTo: 'all' };

export function ClientDiscountPage() {
  const { clientId } = useParams();
  const [searchParams] = useSearchParams();
  const backTo = resolveBackPath(searchParams.get('from'), clientPath(clientId));

  const { client, isLoading: isClientLoading } = useClientDetail(clientId);
  const { coupons, activeCoupon, isLoading: isCouponsLoading } = useClientCoupons(clientId);
  const assignCoupon = useAssignClientCoupon(clientId);
  const deactivateCoupon = useDeactivateClientCoupon(clientId);

  const [preview, setPreview] = useState(INITIAL_PREVIEW);
  const [couponIdToDeactivate, setCouponIdToDeactivate] = useState(null);

  if (isClientLoading) return <PageLoader />;

  const confirmDeactivate = () =>
    deactivateCoupon.mutate(couponIdToDeactivate, { onSettled: () => setCouponIdToDeactivate(null) });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <BackLink to={backTo}>رجوع لملف العميل</BackLink>
        <PageHeader
          title={`خصم مخصّص – ${client?.name || '...'}`}
          description="يُطبَّق على رسوم السنة الأولى للطلبات القادمة فقط (المدفوع سابقًا لا يتأثر)"
          actions={
            isCouponsLoading ? (
              <Spinner />
            ) : (
              <ActiveDiscountBadge
                activeCoupon={activeCoupon}
                onDeactivate={setCouponIdToDeactivate}
                isDeactivating={deactivateCoupon.isPending}
              />
            )
          }
        />
      </div>

      <div className="flex flex-col items-start gap-5 lg:flex-row">
        <Card className="w-full lg:w-96 lg:shrink-0">
          <h3 className="mb-4 font-bold text-foreground">إعداد الخصم</h3>
          <DiscountForm
            onSubmit={(values) => assignCoupon.mutate(values)}
            isSubmitting={assignCoupon.isPending}
            onPreviewChange={setPreview}
          />
        </Card>

        <Card className="grid w-full min-w-0 flex-1 gap-6">
          <section className="grid gap-4">
            <div>
              <h3 className="font-bold text-foreground">تقدير الأثر على الطلبات القادمة</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                الخصم يُطبَّق على <strong className="text-foreground">رسوم السنة الأولى</strong> للطلبات القادمة فقط. السنوات
                الإضافية برسومها كاملة، والمدفوع سابقًا لا يتأثر. هذا تقدير توضيحي وليس مبنيًا على بيانات عقد حقيقي.
              </p>
            </div>
            <DiscountImpactTable rows={getDiscountPreviewRows(preview)} />
          </section>

          <section className="grid gap-4 border-t border-border pt-6">
            <h3 className="font-bold text-foreground">سجل الخصومات</h3>
            <DiscountHistoryTable
              coupons={coupons}
              isLoading={isCouponsLoading}
              onDeactivate={setCouponIdToDeactivate}
              isDeactivating={deactivateCoupon.isPending}
            />
          </section>
        </Card>
      </div>

      <ConfirmDialog
        open={couponIdToDeactivate !== null}
        onOpenChange={(open) => !open && setCouponIdToDeactivate(null)}
        title="إلغاء تفعيل الخصم"
        description="هل أنت متأكد من إلغاء تفعيل هذا الخصم؟"
        destructive
        isLoading={deactivateCoupon.isPending}
        onConfirm={confirmDeactivate}
      />
    </div>
  );
}
