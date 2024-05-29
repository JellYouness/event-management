import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useEffect, useState } from 'react';
import useProgressBar from '@common/hooks/useProgressBar';
import { CRUD_ACTION, Id } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { AccessTime, Add, Create, EventSeat, HistoryEdu, LocationOn } from '@mui/icons-material';
import dayjs from 'dayjs';
import useEvents from '@modules/events/hooks/api/useEvents';
import { Event } from '@modules/events/defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';

const EventPage: NextPage = () => {
  const router = useRouter();
  const { start, stop } = useProgressBar();
  const { readOne, registerOne } = useEvents();
  const [loaded, setLoaded] = useState(false);
  const [item, setItem] = useState<null | Event>(null);
  const id: Id = Number(router.query.id);
  const { user } = useAuth();

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
        title={Labels.Events.ReadAll}
        action={{
          label: Labels.Events.EditOne,
          startIcon: <Create />,
          onClick: () => router.push(Routes.Events.EditOne.replace('[id]', id.toString())),
          permission: {
            entity: Namespaces.Events,
            action: CRUD_ACTION.UPDATE,
            entityId: item?.id,
          },
        }}
      />
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: Routes.Common.Home },
          { name: Labels.Events.Items, href: Routes.Events.ReadAll },
          { name: item ? item.name : Labels.Users.EditOne },
        ]}
      />
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <Stack spacing={2.5}>
                {item?.isCanceled ? (
                  <Typography color="white" bgcolor="red" textAlign="center" variant="body1">
                    Canceled
                  </Typography>
                ) : (
                  <Typography color="white" bgcolor="green" textAlign="center" variant="body1">
                    Active
                  </Typography>
                )}
                <Typography variant="h3">{item?.name}</Typography>
                <Stack direction="row" alignItems="center" spacing={2} my={1}>
                  <AccessTime color="success" />
                  <Typography variant="h6" fontWeight={400}>
                    {item?.date.toString()}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} my={1}>
                  <LocationOn color="success" />
                  <Typography variant="h6" fontWeight={400}>
                    {item?.location}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} my={1}>
                  <EventSeat color="success" />
                  <Typography variant="body1">
                    {item?.participants}/{item?.maxParticipants}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} my={1}>
                  <HistoryEdu color="success" />
                  <Typography variant="body1">By {item?.user?.name}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={5}>
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
          <Typography variant="h6" mt={2}>
            Description
          </Typography>
          <Typography variant="body1">{item?.description}</Typography>
        </CardContent>
        <CardActions>
          {item?.participants && item?.participants < item?.maxParticipants ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                registerOne(id, { userId: user?.id } as any, {
                  displayProgress: true,
                  displaySuccess: true,
                })
              }
            >
              Register
            </Button>
          ) : (
            <Button variant="contained" color="primary" disabled>
              Full
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default withAuth(
  withPermissions(EventPage, {
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
