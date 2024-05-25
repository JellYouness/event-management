import PageHeader from '@common/components/lib/partials/PageHeader';
import Routes from '@common/defs/routes';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import { NextPage } from 'next';
import Link from 'next/link';

const Index: NextPage = () => {
  return (
    <>
      <PageHeader title="Dashboard" />
      <Link href={Routes.Users.ReadAll}>Users</Link>
      <br />
      <Link href={Routes.Events.ReadAll}>Events</Link>
    </>
  );
};

export default withAuth(Index, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
