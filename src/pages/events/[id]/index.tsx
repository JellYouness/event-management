import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useEffect, useState } from 'react';
import useProgressBar from '@common/hooks/useProgressBar';
import { User } from '@modules/users/defs/types';
import useUsers from '@modules/users/hooks/api/useUsers';
import { CRUD_ACTION, Id } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import UpdateUserForm from '@modules/users/components/partials/UpdateUserForm';
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { AccessTime, Add, EventSeat, LocationOn } from '@mui/icons-material';
import dayjs from 'dayjs';

const EventPage: NextPage = () => {
  const router = useRouter();
  const { start, stop } = useProgressBar();
  const { readOne } = useUsers();
  const [loaded, setLoaded] = useState(false);
  const [item, setItem] = useState<null | User>(null);
  const id: Id = Number(router.query.id);

  useEffect(() => {
    if (loaded) {
      stop();
    } else {
      start();
    }
  }, [loaded]);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    if (id) {
      const { data } = await readOne(id);
      if (data) {
        if (data.item) {
          setItem(data.item);
        }
      }
      setLoaded(true);
    }
  };

  return (
    <>
      <PageHeader
        title={Labels.Users.EditOne}
        action={{
          label: Labels.Events.EditOne,
          startIcon: <Add />,
          onClick: () => router.push(Routes.Events.CreateOne),
          permission: {
            entity: Namespaces.Users,
            action: CRUD_ACTION.CREATE,
          },
        }}
      />
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: Routes.Common.Home },
          { name: Labels.Users.Items, href: Routes.Users.ReadAll },
          { name: item ? item.email : Labels.Users.EditOne },
        ]}
      />
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography color="white" bgcolor="green" textAlign="center" variant="body1">
                Open
              </Typography>
              <Typography variant="h3">Title</Typography>
              <Stack direction="row" alignItems="center" spacing={2} my={1}>
                <AccessTime />
                <Typography variant="h6">Date</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2} my={1}>
                <LocationOn />
                <Typography variant="h6">Location</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2} my={1}>
                <EventSeat />
                <Typography variant="body1"> 50/</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Image
                src="/event.avif"
                alt="Event 1"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
              />
            </Grid>
          </Grid>
          <Typography variant="h6">Description</Typography>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in odio in odio varius
            tincidunt. Sed in odio in odio varius tincidunt. Sed in odio in odio varius tincidunt.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary">
            Register
          </Button>
          <Button variant="contained" color="info">
            Share
          </Button>
        </CardActions>
      </Card>
      {/* {item && <UpdateUserForm item={item} />} */}
    </>
  );
};

export default withAuth(
  withPermissions(EventPage, {
    requiredPermissions: [
      {
        entity: Namespaces.Users,
        action: CRUD_ACTION.UPDATE,
      },
    ],
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
