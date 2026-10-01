import { Link, useParams, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { PageLoader } from '@/shared/components/page-loader';
import { UserContractsTable } from '@/features/users/components/user-contracts-table';
import { UserDetailsCard } from '@/features/users/components/user-details-card';
import { useUser } from '@/features/users/hooks/use-user';
import { DEFAULT_BACK_URL, isClientFileRoute, resolveBackUrl } from '@/features/users/lib/user-route';
import { ClientFilePage } from '@/features/users/pages/client-file-page';

function UserDetails({ userId, backUrl }) {
  const { data, isLoading, isError } = useUser(userId);
  const user = data?.user;

  if (isLoading) return <PageLoader />;
  if (isError || !user) return <p className="p-6 text-center text-danger">حدث خطأ أثناء تحميل بيانات المستخدم</p>;

  return (
    <div>
      <PageHeader
        title={user.full_name || user.name || 'تفاصيل المستخدم'}
        description="تفاصيل المستخدم"
        actions={<Link to={backUrl} className="text-sm text-muted-foreground hover:text-primary">رجوع</Link>}
      />
      <UserDetailsCard user={user} backUrl={backUrl} />
      <UserContractsTable contracts={data.contracts ?? []} />
    </div>
  );
}

/** /home/users/:userId — a user's profile and orders (client files are handled elsewhere). */
export function UserDetailsPage() {
  const { userId } = useParams();
  const from = useSearchParams()[0].get('from') || DEFAULT_BACK_URL;

  if (isClientFileRoute(userId, from)) return <ClientFilePage title="ملف العميل" />;
  return <UserDetails userId={userId} backUrl={resolveBackUrl(from)} />;
}
