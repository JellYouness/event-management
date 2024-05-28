import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import MyEventsTable from '@modules/myevents/components/partials/MyEventsTable';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useRouter } from 'next/router';
import { Add } from '@mui/icons-material';
import PageHeader from '@common/components/lib/partials/PageHeader';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';

const MyEventsPage: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title={Labels.MyEvents.ReadAll}
        action={{
          label: Labels.MyEvents.NewOne,
          startIcon: <Add />,
          onClick: () => router.push(Routes.MyEvents.CreateOne),
          permission: {
            entity: Namespaces.Events,
            action: CRUD_ACTION.CREATE,
          },
        }}
      />
      <CustomBreadcrumbs
        links={[{ name: 'Dashboard', href: Routes.Common.Home }, { name: Labels.MyEvents.Items }]}
      />
      <MyEventsTable ownItems />
    </>
  );
};

export default withAuth(
  withPermissions(MyEventsPage, {
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
