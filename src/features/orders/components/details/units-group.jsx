import { Building2, Home } from 'lucide-react';
import { AccentCard, EditButton, GridField, GroupSection } from './detail-primitives';

const UNIT_FIELDS = [
  ['number', 'رقم الوحدة'],
  ['type', 'النوع'],
  ['use', 'الاستخدام'],
  ['floor', 'الدور'],
  ['area', 'المساحة'],
  ['rooms', 'الغرف'],
  ['halls', 'الصالات'],
  ['councils', 'المجالس'],
  ['bathrooms', 'دورات المياه'],
  ['kitchens', 'المطابخ'],
  ['window_ac', 'مكيف شباك'],
  ['split_ac', 'مكيف سبليت'],
  ['air_conditioners', 'عدد المكيفات'],
  ['furnished', 'مؤثثة'],
  ['kitchen_tank', 'خزان المطبخ'],
  ['kitchen_cabinets', 'خزائن المطبخ'],
  ['electricity_meter', 'عداد الكهرباء'],
  ['electricity_meter_number', 'رقم عداد الكهرباء'],
  ['electricity_meter_ownership', 'ملكية عداد الكهرباء'],
  ['water_meter', 'عداد المياه'],
  ['water_meter_number', 'رقم عداد المياه'],
  ['water_meter_ownership', 'ملكية عداد المياه'],
  ['gas_meter', 'عداد الغاز'],
  ['parking_spaces', 'مواقف السيارات'],
];

function UnitCard({ unit, onEdit }) {
  return (
    <div className="rounded-xl border-2 border-primary bg-surface p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Home className="size-4 shrink-0 text-primary" />
          <h5 className="text-sm font-black">{unit.title}</h5>
          {unit.badge && <span className="rounded-full bg-info-soft px-2 py-0.5 text-xs font-bold text-info">{unit.badge}</span>}
        </div>
        {onEdit && <EditButton onClick={onEdit} />}
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-2.5">
        {UNIT_FIELDS.map(([key, label]) => (
          <GridField key={key} label={label} value={unit[key]} />
        ))}
      </div>
    </div>
  );
}

/** Group 3: every unit of the contract. */
export function UnitsGroup({ order, onEdit }) {
  const units = order.units ?? [];
  const unitCount = order.units_count ?? units.length;

  return (
    <GroupSection
      title="المجموعة 3 - الوحدات"
      end={
        <span className="whitespace-nowrap rounded-full bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning">
          عدد الوحدات المضافة من العميل: {unitCount}
        </span>
      }
    >
      <AccentCard tone="gold" icon={Building2} title="الوحدات">
        <div className="space-y-3">
          {units.length === 0 ? (
            <p className="py-4 text-center text-xs font-medium text-muted-foreground">لا توجد وحدات مرتبطة بهذا الطلب</p>
          ) : (
            units.map((unit) => <UnitCard key={unit.id} unit={unit} onEdit={onEdit ? () => onEdit('units') : undefined} />)
          )}
        </div>
      </AccentCard>
    </GroupSection>
  );
}
