import { Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { LabeledValue } from '@/features/clients/components/labeled-value';

function buildUnitFields(unit) {
  return [
    ['النوع', unit.type],
    ['الرقم', unit.number],
    ['المساحة', `${unit.area} م²`],
    ['الطابق', unit.floor],
    ['الغرف', unit.rooms],
    ['الاستخدام', unit.usage],
  ];
}

/** One unit: a summary line that expands into all its fields. */
export function PropertyUnitRow({ unit }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <div className="flex items-center justify-between gap-3 py-3">
        <p className="min-w-0 text-sm font-bold text-foreground">
          {unit.type} – رقم {unit.number} – {unit.area} م²
        </p>
        <Button variant="ghost" size="sm" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
          <Eye className="size-3.5" />
          عرض
        </Button>
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 gap-2 pb-3 sm:grid-cols-4">
          {buildUnitFields(unit).map(([label, value]) => (
            <LabeledValue key={label} label={label} value={value} />
          ))}
        </div>
      )}
    </div>
  );
}
