import { ArrowUpLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFirstName } from '@/features/dashboard/lib/dashboard-format';
import { START_BUTTON_LABEL } from '@/features/dashboard/lib/dashboard-content';
import { ClockCards } from './clock-cards';
import { GreetingLabel } from './greeting-label';

/** Profile summary, clock and the "start now" button. */
export function WelcomeCard({ user, startHref }) {
  const firstName = getFirstName(user?.name);
  const roleLabel = user?.role_relation?.name ?? user?.role_title ?? '';

  return (
    <aside className="flex min-w-0 flex-col justify-center">
      <div className="rounded-3xl border border-border bg-surface-muted/80 p-5 backdrop-blur-sm sm:p-7">
        <div className="mb-7 flex items-start gap-4">
          <div className="relative shrink-0">
            <span aria-hidden className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-success" />
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt={user?.name ?? 'المستخدم'}
                className="relative size-16 rounded-full border-4 border-surface object-cover"
              />
            ) : (
              <span className="relative flex size-16 items-center justify-center rounded-full border-4 border-surface bg-accent text-accent-foreground">
                <User className="size-7" />
              </span>
            )}
          </div>
          <div className="min-w-0 pt-1">
            <GreetingLabel />
            <h2 className="truncate text-xl font-bold text-foreground">مرحباً بعودتك{firstName ? `، ${firstName}` : ''}</h2>
            {roleLabel && <p className="mt-1 truncate text-sm text-muted-foreground">{roleLabel}</p>}
          </div>
        </div>

        <ClockCards />

        <Link
          to={startHref}
          className="group flex h-14 w-full items-center justify-between rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <span>{START_BUTTON_LABEL}</span>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpLeft className="size-5" strokeWidth={2.25} />
          </span>
        </Link>
      </div>
    </aside>
  );
}
