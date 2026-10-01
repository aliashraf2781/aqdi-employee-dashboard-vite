import { MessageCircle } from 'lucide-react';
import { Card } from '@/shared/components/card';
import { Button } from '@/shared/components/ui/button';
import { ClientStatusBadges } from '@/features/clients/components/client-status-badges';
import { formatJoinedShort, whatsappHref } from '@/features/clients/lib/client-details-format';

function Avatar({ client }) {
  return (
    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-2xl font-bold text-accent-foreground">
      {client.photo ? (
        <img src={client.photo} alt={client.name} className="size-full object-cover" />
      ) : (
        client.name.trim().charAt(0) || '؟'
      )}
    </div>
  );
}

export function ClientProfileCard({ client }) {
  const whatsapp = whatsappHref(client.mobile);

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar client={client} />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">{client.name}</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold tabular-nums text-primary">{client.clientCode}</span>
            <span dir="ltr" className="tabular-nums">
              {client.mobile}
            </span>
            {client.email && <span className="text-xs text-muted-foreground">{client.email}</span>}
            <ClientStatusBadges client={client} />
            <span className="text-xs tabular-nums text-muted-foreground">انضم {formatJoinedShort(client.joinedAt)}</span>
          </div>
        </div>

        {whatsapp && (
          <Button asChild className="bg-whatsapp text-primary-foreground hover:bg-whatsapp-hover">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              واتساب
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
}
