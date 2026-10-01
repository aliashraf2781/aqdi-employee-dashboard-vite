import { Building2, CheckCircle2, Clock, Layers, Mail, MessageCircle, Phone, ShoppingBag, Wallet, XCircle } from 'lucide-react';
import defaultUserImage from '@/assets/users/default-user.jpg';
import { Badge } from '@/shared/components/badge';
import { Card } from '@/shared/components/card';
import { UserActions } from '@/features/users/components/user-actions';

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-full bg-primary p-3 text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-medium">{value || '—'}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3">
      <span className="rounded-full border border-border p-2 text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function getIsActive(user) {
  return user?.is_blocked != null ? !user.is_blocked : Boolean(user?.status);
}

/** Profile summary of a user: photo + status on one side, contact, counters and actions on the other. */
export function UserDetailsCard({ user, backUrl }) {
  const phone = user.mobile || user.phone;
  const isActive = getIsActive(user);
  const name = user.full_name || user.name || '—';
  const totalPaid = parseFloat(user.total_paid_amount || 0).toLocaleString('ar-EG');

  return (
    <section>
      <h2 className="text-lg font-bold">بيــانــات المستخدم :</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-2 bg-surface-muted text-center">
          <img src={user.photo_path || defaultUserImage} alt={name} className="size-28 rounded-full border border-border object-cover" />
          <h3 className="text-lg font-bold">{name}</h3>
          <p className={`flex items-center gap-1.5 text-sm ${isActive ? 'text-success' : 'text-danger'}`}>
            {isActive ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
            {isActive ? 'نشط' : 'موقوف'}
          </p>
          {user.verified && <Badge tone="success">موثق</Badge>}
          {phone && (
            <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" aria-label="مراسلة عبر واتساب" className="rounded-full bg-success p-2.5 text-primary-foreground">
              <MessageCircle className="size-5" />
            </a>
          )}
        </Card>

        <Card className="flex flex-col gap-6 bg-surface-muted lg:col-span-2">
          <div className="flex flex-wrap items-center gap-8">
            <ContactItem icon={Mail} label="البريد الإلكتروني" value={user.email} />
            <ContactItem icon={Phone} label="رقم الجوال" value={phone} />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatItem icon={Building2} label="العقارات" value={user.real_estate_count ?? user.properties_count ?? 0} />
            <StatItem icon={Layers} label="الوحدات" value={user.units_count ?? 0} />
            <StatItem icon={ShoppingBag} label="طلبات مكتملة" value={user.completed_orders_count ?? 0} />
            <StatItem icon={ShoppingBag} label="طلبات غير مكتملة" value={user.incomplete_orders_count ?? user.uncompleted_orders_count ?? 0} />
            <StatItem icon={Wallet} label="إجمالي المدفوع" value={totalPaid} />
            <StatItem icon={Clock} label="تاريخ التسجيل" value={user.date_time || user.created_at || '—'} />
          </div>
          <UserActions user={user} isActive={isActive} phone={phone} backUrl={backUrl} />
        </Card>
      </div>
    </section>
  );
}
