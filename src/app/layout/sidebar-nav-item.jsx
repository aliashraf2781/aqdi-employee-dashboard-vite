import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';

function NavBadge({ useCount }) {
  const count = useCount();
  if (!count) return null;
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-notice px-1.5 text-xs font-semibold text-primary-foreground">
      {count > 99 ? '99+' : count}
    </span>
  );
}

/** One sidebar link, built from a feature manifest. */
export function SidebarNavItem({ feature, collapsed }) {
  const Icon = feature.icon;

  return (
    <NavLink
      to={`/home/${feature.path}`}
      title={collapsed ? feature.label : undefined}
      className={({ isActive }) =>
        cn(
          'flex h-11 items-center gap-2.5 rounded-xl px-3.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-sidebar-foreground/10 text-sidebar-active'
            : 'text-sidebar-foreground hover:bg-sidebar-hover',
          collapsed && 'mx-auto size-11 justify-center px-0',
        )
      }
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      {!collapsed && <span className="flex-1 truncate">{feature.label}</span>}
      {!collapsed && feature.useBadgeCount && <NavBadge useCount={feature.useBadgeCount} />}
    </NavLink>
  );
}
