import { SwitchField } from '@/shared/components/ui/switch-field';
import { SettingsSection } from '@/features/settings/components/settings-section';
import { useSaveAppStatus } from '@/features/settings/hooks/use-app-status';
import { buildMobilePayload } from '@/features/settings/lib/app-status';

/** One switch: while off, mobile app users cannot use the app. Saves immediately. */
export function MobileStatusSection({ mobile, canEdit }) {
  const save = useSaveAppStatus({
    successMessage: 'تم تحديث حالة تطبيق الجوال',
    failureMessage: 'تعذر تحديث حالة تطبيق الجوال',
  });

  return (
    <SettingsSection title="حالة تطبيق الجوال" description="إيقاف تطبيق الجوال يمنع المستخدمين من استخدامه حتى إعادة التشغيل.">
      <SwitchField
        label="تشغيل التطبيق"
        description={mobile.is_open ? 'التطبيق يعمل' : 'التطبيق متوقف'}
        checked={mobile.is_open}
        disabled={!canEdit || save.isPending}
        onCheckedChange={(checked) => save.mutate(buildMobilePayload(checked))}
      />
    </SettingsSection>
  );
}
