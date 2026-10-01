import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';

/** Arabic + English inputs for one text, bound to `<base>_ar` and `<base>_en`. */
export function BilingualField({ register, base, label, hint, multiline = false }) {
  const Input = multiline ? TextareaField : TextField;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input {...register(`${base}_ar`)} dir="rtl" placeholder="عربي" rows={3} />
        <Input {...register(`${base}_en`)} dir="ltr" placeholder="English" rows={3} />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
