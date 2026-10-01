import { Eye, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/shared/components/card';
import { Button } from '@/shared/components/ui/button';
import { PropertyDetails } from '@/features/clients/components/property-details';
import { PropertyUnitRow } from '@/features/clients/components/property-unit-row';

function ToggleButton({ isOpen, onClick, icon: Icon, children }) {
  return (
    <Button variant="ghost" size="lg" aria-expanded={isOpen} onClick={onClick} className="w-full bg-accent text-accent-foreground">
      <Icon className="size-4 shrink-0" />
      {children}
    </Button>
  );
}

function buildMeta(property) {
  const parts = [`شارع: ${property.street || '–'}`, `مبنى ${property.buildingNumber || '–'}`];
  if (property.addedAt) parts.push(`أضيف ${property.addedAt}`);
  if (property.orderId) parts.push(`طلب #${property.orderId}`);
  return parts.join(' · ');
}

function UnitsList({ units }) {
  if (units.length === 0) {
    return <p className="rounded-lg border border-border py-6 text-center text-sm text-muted-foreground">لا توجد وحدات لهذا العقار</p>;
  }
  return (
    <div className="rounded-lg border border-border px-4">
      {units.map((unit) => (
        <PropertyUnitRow key={unit.id} unit={unit} />
      ))}
    </div>
  );
}

/** One property with two expandable parts: its details and its units. */
export function PropertyCard({ property, defaultOpen = false }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(defaultOpen);
  const [isUnitsOpen, setIsUnitsOpen] = useState(defaultOpen);

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div>
        <h2 className="inline-flex items-center gap-2 font-bold text-foreground">
          <span className="size-2 rounded-full bg-primary" aria-hidden />
          {property.title}
        </h2>
        <p className="mt-1.5 text-xs font-medium text-muted-foreground">{buildMeta(property)}</p>
      </div>

      <ToggleButton isOpen={isDetailsOpen} onClick={() => setIsDetailsOpen((open) => !open)} icon={Eye}>
        عرض العقار
      </ToggleButton>
      {isDetailsOpen && <PropertyDetails property={property} />}

      <ToggleButton isOpen={isUnitsOpen} onClick={() => setIsUnitsOpen((open) => !open)} icon={LayoutGrid}>
        عرض وحدات العقار ({property.units.length})
      </ToggleButton>
      {isUnitsOpen && <UnitsList units={property.units} />}
    </Card>
  );
}
