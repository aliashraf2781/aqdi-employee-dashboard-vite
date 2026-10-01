import { useState } from 'react';
import { MessageCircle, MessageSquareText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SmsMessageDialog } from '@/shared/components/sms-message-dialog';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { BlockEmployeeDialog } from '@/features/employees/components/block-employee-dialog';
import { DeleteEmployeeDialog } from '@/features/employees/components/delete-employee-dialog';
import { EmployeeFormDialog } from '@/features/employees/components/employee-form-dialog';
import { NoteFormDialog } from '@/features/employees/components/note-form-dialog';
import { SalaryFormDialog } from '@/features/employees/components/salary-form-dialog';
import { useSendEmployeeSms } from '@/features/employees/hooks/use-employee-mutations';

const { employees: EMPLOYEES, employee_salaries: SALARIES } = PERMISSION_SECTIONS;

/** Button bar on the employee page. Only one dialog is open at a time. */
export function EmployeeActions({ employee, onDeleted }) {
  const { can } = usePermissions();
  const [openDialog, setOpenDialog] = useState(null);
  const sendSms = useSendEmployeeSms();

  const dialogProps = (name) => ({
    open: openDialog === name,
    onOpenChange: (open) => setOpenDialog(open ? name : null),
  });

  const canEdit = can(EMPLOYEES, 'edit');

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canEdit && <Button variant="outline" onClick={() => setOpenDialog('note')}>إضافة ملاحظة</Button>}
      {can(SALARIES, 'create') && <Button variant="outline" onClick={() => setOpenDialog('salary')}>إضافة راتب</Button>}
      {canEdit && <Button variant="outline" onClick={() => setOpenDialog('edit')}>تعديل</Button>}
      {canEdit && (
        <Button variant="outline" onClick={() => setOpenDialog('block')}>
          {employee.is_blocked ? 'إلغاء الحظر' : 'حظر'}
        </Button>
      )}
      {can(EMPLOYEES, 'delete') && (
        <Button variant="destructive" onClick={() => setOpenDialog('delete')}>حذف</Button>
      )}
      {employee.phone && (
        <Button asChild variant="outline">
          <a href={`https://wa.me/${employee.phone}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            واتساب
          </a>
        </Button>
      )}
      <Button variant="outline" onClick={() => setOpenDialog('sms')}>
        <MessageSquareText className="size-4" />
        إرسال رسالة
      </Button>

      <NoteFormDialog employee={employee} {...dialogProps('note')} />
      <SalaryFormDialog employee={employee} {...dialogProps('salary')} />
      <EmployeeFormDialog employee={employee} {...dialogProps('edit')} />
      <BlockEmployeeDialog employee={employee} {...dialogProps('block')} />
      <DeleteEmployeeDialog employee={employee} onDeleted={onDeleted} {...dialogProps('delete')} />
      <SmsMessageDialog
        recipientLabel={`${employee.name} — ${employee.phone ?? ''}`}
        onSend={(message) => sendSms.mutateAsync({ employeeId: employee.id, message })}
        {...dialogProps('sms')}
      />
    </div>
  );
}
