import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { Card } from '@/shared/components/card';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { RecipientPicker } from '@/features/settings/components/recipient-picker';
import { SettingsPageHeader } from '@/features/settings/components/settings-page-header';
import { useSendNotification } from '@/features/settings/hooks/use-send-notification';
import { NOTIFICATION_TARGETS, NOTIFICATION_TARGET_OPTIONS } from '@/features/settings/lib/notification-targets';
import { EMPTY_NOTIFICATION, notificationSchema } from '@/features/settings/schemas/notification-schema';

export function NotificationsPage() {
  const { can } = usePermissions();
  const { register, control, handleSubmit, reset, setValue, formState } = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: EMPTY_NOTIFICATION,
  });
  const send = useSendNotification({ onSuccess: () => reset(EMPTY_NOTIFICATION) });

  const target = NOTIFICATION_TARGETS[useWatch({ control, name: 'target' })];
  const userId = useWatch({ control, name: 'userId' });
  const employeeId = useWatch({ control, name: 'employeeId' });
  const { errors } = formState;

  // Switching the audience forgets the previously picked recipient.
  const targetField = register('target', {
    onChange: () => {
      setValue('userId', '');
      setValue('employeeId', '');
    },
  });

  return (
    <div>
      <SettingsPageHeader title="الإشعارات" description="إرسال إشعار للمستخدمين أو الموظفين" />

      <Card>
        <form onSubmit={handleSubmit((values) => send.mutate(values))} className="flex max-w-xl flex-col gap-4" noValidate>
          <SelectField label="نوع الإرسال" options={NOTIFICATION_TARGET_OPTIONS} {...targetField} />

          {target?.needsUser && (
            <RecipientPicker
              kind="user"
              label="المستخدم"
              value={userId}
              onChange={(id) => setValue('userId', id)}
              error={errors.userId?.message}
            />
          )}
          {target?.needsEmployee && (
            <RecipientPicker
              kind="employee"
              label="الموظف"
              value={employeeId}
              onChange={(id) => setValue('employeeId', id)}
              error={errors.employeeId?.message}
            />
          )}

          <TextField label="العنوان" placeholder="عنوان الإشعار" error={errors.title?.message} {...register('title')} />
          <TextareaField
            label="نص الرسالة"
            placeholder="اكتب محتوى الإشعار هنا..."
            error={errors.body?.message}
            {...register('body')}
          />

          {can(PERMISSION_SECTIONS.notifications, 'create') && (
            <Button type="submit" disabled={send.isPending} className="w-fit min-w-40">
              إرسال الإشعار
              <Send className="size-4" />
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
}
