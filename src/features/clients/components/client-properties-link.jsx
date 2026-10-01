import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';

export function ClientPropertiesLink({ client, to }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="inline-flex items-center gap-2 font-bold text-foreground">
        <Home className="size-4 text-primary" aria-hidden />
        عقارات العميل ووحداته
      </h3>
      <Button asChild variant="outline" size="lg" className="w-full bg-accent text-accent-foreground">
        <Link to={to}>
          <Home className="size-4" />
          فتح عقارات ووحدات العميل ({client.properties} عقار – {client.units} وحدة)
        </Link>
      </Button>
    </section>
  );
}
