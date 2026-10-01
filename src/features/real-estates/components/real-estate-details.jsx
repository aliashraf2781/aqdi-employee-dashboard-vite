import { MessageCircle } from 'lucide-react';
import { DetailCard } from '@/features/real-estates/components/detail-card';
import { DetailSection } from '@/features/real-estates/components/detail-section';
import { InstrumentImages } from '@/features/real-estates/components/instrument-images';
import { getInstrumentTypeLabel } from '@/features/real-estates/lib/real-estate-labels';

const GRID = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3';

function OwnerSection({ estate }) {
  return (
    <DetailSection title="بيانات المالك">
      <div className={GRID}>
        <DetailCard label="رقم الهوية" value={estate.national_num} copyable />
        <DetailCard label="تاريخ الميلاد (ميلادي)" value={estate.DOB} />
        <DetailCard label="تاريخ الميلاد (هجري)" value={estate.dob_hijri} />
        <DetailCard label="رقم الجوال" value={estate.mobile} copyable />
        <DetailCard label="الآيبان" value={estate.iban_bank} copyable />
      </div>
      {estate.mobile && (
        <a
          href={`https://wa.me/${estate.mobile}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <MessageCircle className="size-5 text-success" />
          تواصل عبر واتساب
        </a>
      )}
    </DetailSection>
  );
}

function InstrumentSection({ estate }) {
  return (
    <DetailSection title="بيانات الصك">
      <div className={GRID}>
        <DetailCard label="نوع الوثيقة" value={getInstrumentTypeLabel(estate.instrument_type)} />
        <DetailCard label="رقم الصك" value={estate.instrument_number} copyable />
        <DetailCard label="تاريخ الصك" value={estate.instrument_history} />
        <DetailCard label="رقم السجل العقاري" value={estate.real_estate_registry_number} copyable />
        <DetailCard label="تاريخ أول تسجيل" value={estate.date_first_registration} />
      </div>
      <InstrumentImages estate={estate} />
    </DetailSection>
  );
}

function AddressSection({ estate }) {
  return (
    <DetailSection title="العنوان الوطني">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DetailCard label="المنطقة" value={estate.property_place_name || estate.property_place_id} />
        <DetailCard label="المدينة" value={estate.property_city_name || estate.property_city_id} />
        <DetailCard label="الحي" value={estate.neighborhood} />
        <DetailCard label="الشارع" value={estate.street} />
        <DetailCard label="رقم المبنى" value={estate.building_number} />
        <DetailCard label="رقم إضافي" value={estate.extra_figure} />
        <DetailCard label="الرمز البريدي" value={estate.postal_code} />
      </div>
    </DetailSection>
  );
}

export function RealEstateDetails({ estate }) {
  return (
    <div className="flex flex-col gap-8">
      <OwnerSection estate={estate} />
      <InstrumentSection estate={estate} />
      <AddressSection estate={estate} />
    </div>
  );
}
