import { BriefcaseBusiness, CalendarDays, Mail, ShieldCheck, ShieldX, Wallet } from 'lucide-react';
import { Card } from '@/shared/components/card';
import { cn } from '@/shared/lib/cn';
import { formatSalary, formatShortDate } from '@/features/employees/lib/employee-display';
import { WorkPeriodBadge } from '@/features/employees/components/work-period-badge';

const TONE_CLASSES = {
  neutral: 'bg-neutral-soft text-neutral',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning',
  primary: 'bg-accent text-accent-foreground',
};

function StatCard({ icon: Icon, label, value, tone = 'neutral' }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', TONE_CLASSES[tone])}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-bold text-foreground">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}

function isEmployeeActive(employee) {
  if (employee?.is_active != null) return Boolean(employee.is_active);
  return !employee?.is_blocked;
}

/** The five summary cards plus the work period badge. */
export function EmployeeSummary({ employee }) {
  const isActive = isEmployeeActive(employee);
  const salary = formatSalary(employee?.base_salary);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={CalendarDays} label="تاريخ الإنشاء" value={formatShortDate(employee?.created_at)} />
        <StatCard
          icon={isActive ? ShieldCheck : ShieldX}
          tone={isActive ? 'success' : 'danger'}
          label="الحالة"
          value={<span className={isActive ? 'text-success' : 'text-danger'}>{isActive ? 'مُفعّل' : 'محظور'}</span>}
        />
        <StatCard icon={Mail} tone="primary" label="البريد الإلكتروني" value={employee?.email || '---'} />
        <StatCard icon={Wallet} tone="success" label="الراتب الأساسي" value={salary ? `${salary} ريال` : '---'} />
        <StatCard icon={BriefcaseBusiness} tone="warning" label="المسمى الوظيفي" value={employee?.role || 'موظف'} />
      </div>
      {employee?.work_period && (
        <div className="mt-3">
          <WorkPeriodBadge workPeriod={employee.work_period} />
        </div>
      )}
    </>
  );
}
