import { Loader2, LogOut } from 'lucide-react';
import { useLogout } from '@/features/auth';
import { usePermissions } from '@/features/permissions';

export function SidebarUserCard({ collapsed }) {
  const { user } = usePermissions();
  const { mutate: logout, isPending } = useLogout();

  const name = user?.name || 'مستخدم';
  const role = user?.role_title || user?.role_relation?.name || user?.role?.name;

  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-sidebar-foreground/10 p-2.5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {name.trim().charAt(0)}
      </span>
      {!collapsed && (
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-sidebar-foreground">{name}</span>
          {role && <span className="block truncate text-xs text-sidebar-foreground/70">{role}</span>}
        </span>
      )}
      <button
        type="button"
        onClick={() => logout()}
        disabled={isPending}
        aria-label="تسجيل الخروج"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      </button>
    </div>
  );
}
