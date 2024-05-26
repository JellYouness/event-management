import PageHeader from '@common/components/lib/partials/PageHeader';
import Routes from '@common/defs/routes';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import MyEventsTable from '@modules/myevents/components/partials/MyEventsTable';
import { NextPage } from 'next';
import Link from 'next/link';

const Index: NextPage = () => {
  return (
    <>
      <PageHeader title="Dashboard" />
      <MyEventsTable />
    </>
  );
};

export default withAuth(Index, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
