import { MottoPanel } from './motto-panel';
import { WelcomeCard } from './welcome-card';

export function HeroSection({ user, startHref }) {
  return (
    <section className="relative isolate overflow-hidden rounded-card border border-border bg-surface">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -end-24 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -start-20 size-72 rounded-full bg-success/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/25 to-transparent" />
      </div>

      <div className="grid gap-8 p-6 lg:grid-cols-2 lg:gap-12 lg:p-10">
        <MottoPanel />
        <WelcomeCard user={user} startHref={startHref} />
      </div>
    </section>
  );
}
