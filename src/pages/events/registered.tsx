import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useRouter } from 'next/router';
import PageHeader from '@common/components/lib/partials/PageHeader';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import EventsCards from '@modules/events/components/partials/EventsCards';

const RegistredEventsPage: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <PageHeader title={Labels.Events.Registered} />
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: Routes.Events.Registered },
          { name: Labels.Events.Registered },
        ]}
      />
      <EventsCards filterToolbar registredtems />
    </>
  );
};

export default withAuth(
  withPermissions(RegistredEventsPage, {
    requiredPermissions: [
      {
        entity: Namespaces.Events,
        action: CRUD_ACTION.READ,
      },
    ],
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
