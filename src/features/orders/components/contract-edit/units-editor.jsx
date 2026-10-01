import { Inbox, Loader2, Save } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { getOrderUnits, getOrderUnitsCount } from '../../lib/order-detail-steps';
import { UnitBlock } from './unit-block';

function UnitsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-surface px-6 py-16 text-muted-foreground">
      <Inbox className="size-9" />
      <p className="text-sm font-bold">لا توجد وحدات مرتبطة بهذا العقد</p>
      <p className="text-xs">عدد الوحدات = 0</p>
    </div>
  );
}

/** Editor of the units section: one form per unit and a single "save" that saves them all. */
export function UnitsEditor({ order }) {
  const units = getOrderUnits(order);
  const unitsCount = getOrderUnitsCount(order);
  const isEmpty = unitsCount === 0 || units.length === 0;
  const formHandles = useRef(new Map());
  const [isSavingAll, setIsSavingAll] = useState(false);

  const saveAll = async () => {
    setIsSavingAll(true);
    try {
      await Promise.all([...formHandles.current.values()].map((handle) => handle.save()));
    } finally {
      setIsSavingAll(false);
    }
  };

  const registerForm = (key) => (handle) => {
    if (handle) formHandles.current.set(key, handle);
    else formHandles.current.delete(key);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm font-bold">
        وحدات العقد
        <span className="ms-2 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">{unitsCount}</span>
      </p>

      {isEmpty ? (
        <UnitsEmptyState />
      ) : (
        <>
          <div className="space-y-8 divide-y divide-border">
            {units.map((unit, index) => {
              const key = unit?.id ?? `unit-${index}`;
              return (
                <div key={key} className={index === 0 ? undefined : 'pt-8'}>
                  <UnitBlock unit={unit} order={order} index={index} canDetach={Number(unitsCount) > 1} formRef={registerForm(key)} />
                </div>
              );
            })}
          </div>

          <Button type="button" size="lg" className="w-full bg-gold hover:bg-gold/90" onClick={saveAll} disabled={isSavingAll}>
            {isSavingAll ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            حفظ التعديلات
          </Button>
        </>
      )}
    </div>
  );
}
