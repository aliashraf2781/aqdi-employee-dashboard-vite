import { UserRound } from 'lucide-react';
import { AccentCard, Field } from './detail-primitives';

/** The owner's legal agent (وكيل المالك), shown only when the order has one. */
export function LegalAgentCard({ agent, onEdit }) {
  if (!agent) return null;

  return (
    <AccentCard tone="violet" icon={UserRound} title="الوكيل / المالك بوكالة" onEdit={onEdit}>
      <div className="space-y-2">
        <Field label="هوية الوكيل" value={agent.id_num} />
        <Field label="جوال الوكيل" value={agent.phone} />
        <Field label="تاريخ الميلاد" value={agent.dob_display} />
        <Field label="تاريخ ميلاد هجري" value={agent.agent_dob_hijri} />
        <Field label="هوية سجل الوكيل" value={agent.agent_record_id} />
        <Field label="آيبان الوكيل" value={agent.agent_iban} />
        <Field label="رقم الوكالة" value={agent.agency_number} />
        <Field label="تاريخ الوكالة" value={agent.agency_date} />
      </div>
    </AccentCard>
  );
}

/** The endowment trustee (ناظر الوقف), shown only for endowment deeds. */
export function EndowmentNazirCard({ nazir, onEdit }) {
  if (!nazir) return null;

  return (
    <AccentCard tone="info" icon={UserRound} title="ناظر الوقف" onEdit={onEdit}>
      <div className="space-y-2">
        <Field label="هوية الناظر / الوكيل" value={nazir.id_num} />
        <Field label="جوال الناظر / الوكيل" value={nazir.phone} />
        <Field label="تاريخ الميلاد" value={nazir.dob_display} />
        <Field label="أكثر من صك نظارة" value={nazir.is_multiple} />
      </div>
    </AccentCard>
  );
}
