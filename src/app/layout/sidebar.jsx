import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { usePermissions } from '@/features/permissions';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/lib/cn';
import { features } from '@/app/features';
import { DESKTOP_MEDIA_QUERY, useSidebarStore } from '@/app/layout/sidebar-store';
import { SidebarNavItem } from '@/app/layout/sidebar-nav-item';
import { SidebarUserCard } from '@/app/layout/sidebar-user-card';

const NAV_GROUPS = ['main', 'secondary'];

export function Sidebar() {
  const { can, isReady } = usePermissions();
  const { isDark, toggleTheme } = useTheme();
  const { isOpen, setOpen } = useSidebarStore();

  // Expanded on desktop, hidden on small screens.
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const sync = () => setOpen(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [setOpen]);

  const visibleGroups = NAV_GROUPS.map((group) =>
    features.filter((feature) => feature.navGroup === group && isReady && can(feature.section, 'view')),
  ).filter((items) => items.length > 0);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة الجانبية"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-overlay/30 desktop:hidden"
        />
      )}
      <aside
        className={cn(
          'z-50 flex h-screen shrink-0 flex-col bg-gradient-to-b from-sidebar to-sidebar-dark p-3.5 transition-all duration-300',
          'max-desktop:fixed max-desktop:inset-y-0 max-desktop:start-0',
          isOpen ? 'w-64' : 'w-20 max-desktop:hidden',
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {isOpen && <h2 className="text-base font-bold text-sidebar-foreground">لوحة الموظفين</h2>}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
            className="flex size-9 items-center justify-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-hover"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
          {visibleGroups.map((items) => (
            <div key={items[0].id} className="flex flex-col gap-1 border-t border-sidebar-foreground/10 pt-3 first:border-0 first:pt-0">
              {items.map((feature) => (
                <SidebarNavItem key={feature.id} feature={feature} collapsed={!isOpen} />
              ))}
            </div>
          ))}
        </nav>

        <div className="mt-3">
          <SidebarUserCard collapsed={!isOpen} />
        </div>
      </aside>
    </>
  );
}
