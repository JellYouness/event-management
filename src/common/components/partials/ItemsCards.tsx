import { CRUD_ACTION, CrudRoutes, CrudRow, Id } from '@common/defs/types';
import usePermissions from '@modules/permissions/hooks/usePermissions';
import { UseItems } from '@common/hooks/useItems';
import { AccessTime, EventSeat, LocationOn } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  Skeleton,
  Grid,
  Badge,
  Chip,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Event } from '@modules/events/defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';
import useFilter from '@common/hooks/useFilter';
import FilterToolbar from '@common/components/partials/FilterToolbar';

interface ItemsCardsProps<Item, CreateOneInput, UpdateOneInput, Row> {
  namespace: string;
  routes: CrudRoutes;
  useItems: UseItems<Item, CreateOneInput, UpdateOneInput>;
  itemToRow: (item: Item) => Row;
  fetchItems?: boolean;
  ownItems?: boolean;
  registredtems?: boolean;
  filterToolbar?: boolean;
}

const ItemsCards = <Item, CreateOneInput, UpdateOneInput, Row extends CrudRow>(
  props: ItemsCardsProps<Item, CreateOneInput, UpdateOneInput, Row>
) => {
  const {
    namespace,
    routes,
    useItems,
    itemToRow,
    fetchItems,
    ownItems,
    registredtems,
    filterToolbar,
  } = props;
  const filterItems = useFilter();
  const router = useRouter();
  const { items } = useItems({
    fetchItems: fetchItems,
    fetchOwnItems: ownItems,
    fetchRegistredItems: registredtems,
  });
  const { can, canNot } = usePermissions();
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (items) {
      const itemsRows = items.map((item) => itemToRow(item));
      setRows(itemsRows);
    }
  }, [items]);

  const filteredRows = rows.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(filterItems.search.toLowerCase());
    const matchesDate = filterItems.date
      ? dayjs(item.date).isSame(dayjs(filterItems.date), 'day')
      : true;
    const matchesLocation = item.location
      .toLowerCase()
      .includes(filterItems.location.toLowerCase());
    const matchesEventStatus =
      filterItems.eventStatus === 'all' ||
      (filterItems.eventStatus === 'upcoming' && dayjs(item.date).isAfter(dayjs())) ||
      (filterItems.eventStatus === 'past' && dayjs(item.date).isBefore(dayjs()));
    const matchesActivityStatus =
      filterItems.activityStatus === 'all' ||
      (filterItems.activityStatus === 'active' && !item.isCanceled) ||
      (filterItems.activityStatus === 'canceled' && item.isCanceled);
    const matchesNotFull = !filterItems.notFull || item.participants < item.maxParticipants;

    return (
      matchesSearch &&
      matchesDate &&
      matchesLocation &&
      matchesEventStatus &&
      matchesActivityStatus &&
      matchesNotFull
    );
  });
  return (
    <>
      <Box sx={{ minHeight: 550, px: 2 }}>
        {filterToolbar && <FilterToolbar filterItems={filterItems} />}
        {!items ? (
          <>
            <Grid container spacing={4} marginTop={6}>
              {Array.from(Array(4)).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rounded" height={350} />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Grid container spacing={4} marginTop={2}>
              {filteredRows.map((item) => (
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    onClick={() => router.push(`/events/${item.id}`)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        scale: '101%',
                        transition: 'all .2s',
                      },
                    }}
                  >
                    {item.isCanceled ? (
                      <Badge
                        badgeContent="Canceled"
                        color="error"
                        sx={{
                          '&>span': {
                            transform: 'none',
                            fontSize: 'large',
                            p: 1.5,
                            borderRadius: 0,
                            borderBottomLeftRadius: '10px',
                          },
                        }}
                      >
                        <Image
                          src="/event.avif"
                          alt="Event 1"
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ width: '100%', height: 'auto', filter: 'grayscale(100%)' }}
                        />
                      </Badge>
                    ) : (
                      <Image
                        src="/event.avif"
                        alt="Event 1"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h5">{item.name}</Typography>
                      <Stack direction="row" alignItems="center" spacing={2} my={1}>
                        <AccessTime sx={{ color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {dayjs(item.date).format('ddd, D MMM, YYYY | HH:mm')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2} my={1}>
                        <LocationOn sx={{ color: 'text.secondary' }} />
                        <Typography variant="body1">{item.location}</Typography>
                      </Stack>
                      {/* <Stack direction="row" alignItems="center" spacing={2} my={1}>
                        <FiberManualRecord
                          fontSize="small"
                          color={item.isCanceled ? 'error' : 'success'}
                        />
                        <Typography marginLeft={1} variant="body2">
                          Active
                        </Typography>
                      </Stack> */}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Stack direction="row" alignItems="center" spacing={2} my={1} ml={1}>
                        <EventSeat sx={{ color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {item.participants}/{item.maxParticipants}
                        </Typography>
                      </Stack>
                      {!ownItems &&
                        !registredtems &&
                        (item.userId === user?.id ? (
                          <Chip variant="outlined" label="Your Event" color="info" />
                        ) : item.participants < item.maxParticipants ? (
                          <Button
                            startIcon={<LocationOn />}
                            variant="contained"
                            disabled={item.isCanceled}
                          >
                            Register
                          </Button>
                        ) : (
                          <Button variant="contained" color="primary" disabled>
                            Full
                          </Button>
                        ))}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </>
  );
};

export default ItemsCards;
