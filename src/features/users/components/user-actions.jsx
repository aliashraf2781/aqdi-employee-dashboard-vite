import { useState } from 'react';
import { Ban, MessageSquareText, ShieldCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { SmsMessageDialog } from '@/shared/components/sms-message-dialog';
import { useDeleteUser, useSendUserSms, useToggleUserBlock } from '@/features/users/hooks/use-user-mutations';

/** SMS, block/activate and delete buttons for one user, each with its own dialog. */
export function UserActions({ user, isActive, phone, backUrl }) {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(null);
  const toggleBlock = useToggleUserBlock();
  const deleteUser = useDeleteUser();
  const sendSms = useSendUserSms();

  const dialogProps = (name) => ({ open: openDialog === name, onOpenChange: (open) => setOpenDialog(open ? name : null) });
  const userName = user.full_name || user.name;

  async function confirm(mutation, onDone) {
    try {
      await mutation();
      setOpenDialog(null);
      onDone?.();
    } catch {
      // The mutation hook already showed the error toast.
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button variant="outline" size="sm" onClick={() => setOpenDialog('sms')}>
        <MessageSquareText className="size-4" />
        رسالة
      </Button>
      <Button variant="outline" size="sm" onClick={() => setOpenDialog('block')}>
        {isActive ? <Ban className="size-4" /> : <ShieldCheck className="size-4" />}
        {isActive ? 'إيقاف' : 'تفعيل'}
      </Button>
      <Button variant="destructive" size="sm" onClick={() => setOpenDialog('delete')}>
        <Trash2 className="size-4" />
        حذف
      </Button>

      <SmsMessageDialog
        recipientLabel={`${userName ?? ''} — ${phone ?? ''}`}
        onSend={(message) => sendSms.mutateAsync({ userId: user.id, mobile: phone, message })}
        {...dialogProps('sms')}
      />
      <ConfirmDialog
        title={isActive ? 'إيقاف حساب' : 'تفعيل حساب'}
        description={`هل أنت متأكد من ${isActive ? 'إيقاف' : 'تفعيل'} حساب الضيف؟ هذا الإجراء يمكن التراجع عنه بعد التأكيد!`}
        confirmLabel={isActive ? 'تأكيد الإيقاف' : 'تأكيد التفعيل'}
        isLoading={toggleBlock.isPending}
        onConfirm={() => confirm(() => toggleBlock.mutateAsync(user.id))}
        {...dialogProps('block')}
      />
      <ConfirmDialog
        title="هل أنت متأكد من حذف المستخدم"
        description={`${userName ?? ''} — هذا الإجراء لا يمكن التراجع عنه بعد الحذف! سيتم فقدان كافة البيانات المرتبطة بهذا المستخدم.`}
        confirmLabel="تأكيـد الحـذف"
        destructive
        isLoading={deleteUser.isPending}
        onConfirm={() => confirm(() => deleteUser.mutateAsync(user.id), () => navigate(backUrl))}
        {...dialogProps('delete')}
      />
    </div>
  );
}
