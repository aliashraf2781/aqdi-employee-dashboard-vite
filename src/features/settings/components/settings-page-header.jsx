import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';

export const SETTINGS_HOME_PATH = '/home/settings';

/** Page title with a "back to settings" link, plus any extra action buttons. */
export function SettingsPageHeader({ title, description, actions, backTo = SETTINGS_HOME_PATH }) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={
        <>
          {actions}
          <Button asChild variant="outline">
            <Link to={backTo}>
              <ArrowRight className="size-4" />
              رجوع
            </Link>
          </Button>
        </>
      }
    />
  );
}
