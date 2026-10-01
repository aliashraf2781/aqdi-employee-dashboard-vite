import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';

const CHANNEL_OPTIONS = [
  { value: 'all', label: 'كل القنوات' },
  { value: 'google', label: 'قوقل' },
  { value: 'meta', label: 'ميتا' },
  { value: 'tiktok', label: 'تيك توك' },
  { value: 'snapchat', label: 'سناب' },
  { value: 'twitter', label: 'إكس' },
];

const EXPORT_FORMATS = [
  { format: 'pdf', label: 'PDF' },
  { format: 'xlsx', label: 'Excel' },
  { format: 'csv', label: 'CSV' },
  { format: 'email', label: 'إرسال بالبريد' },
];

/** Export buttons + the channel filter of the reports tab. */
export function ReportExportBar({ channel, onChannelChange, onExport, disabled }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {EXPORT_FORMATS.map(({ format, label }) => (
          <Button key={format} variant="outline" size="sm" disabled={disabled} onClick={() => onExport(format)}>
            {label}
          </Button>
        ))}
      </div>
      <SelectField value={channel} onChange={(event) => onChannelChange(event.target.value)} options={CHANNEL_OPTIONS} aria-label="القناة" />
    </div>
  );
}
