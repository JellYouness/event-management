import ConfirmDialog from '@common/components/lib/feedbacks/ConfirmDialog';
import MenuPopover from '@common/components/lib/utils/MenuPopover/MenuPopover';
import { CRUD_ACTION, CrudRoutes, CrudRow, Id } from '@common/defs/types';
import usePermissions from '@modules/permissions/hooks/usePermissions';
import { UseItems } from '@common/hooks/useItems';
import {
  Cancel,
  DeleteOutline,
  Edit,
  MoreVert,
  AccessTime,
  EventSeat,
  FiberManualRecord,
  LocationOn,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  Skeleton,
  Grid,
  Badge,
} from '@mui/material';
import {
  DataGrid,
  frFR,
  GridColumns,
  GridToolbar,
  GridEnrichedColDef,
  GridSortModel,
} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Event } from '@modules/myevents/defs/types';

interface ItemsCardsProps<Item, CreateOneInput, UpdateOneInput, Row> {
  namespace: string;
  routes: CrudRoutes;
  useItems: UseItems<Item, CreateOneInput, UpdateOneInput>;
  itemToRow: (item: Item) => Row;
}

const ItemsCards = <Item, CreateOneInput, UpdateOneInput, Row extends CrudRow>(
  props: ItemsCardsProps<Item, CreateOneInput, UpdateOneInput, Row>
) => {
  const { namespace, routes, useItems, itemToRow } = props;
  const router = useRouter();
  const { items } = useItems({ fetchItems: true });
  const { can, canNot } = usePermissions();
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    if (items) {
      const itemsRows = items.map((item) => itemToRow(item));
      setRows(itemsRows);
    }
  }, [items]);
  return (
    <>
      <Box sx={{ height: 550 }}>
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
              {rows.map((item) => (
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    onClick={() => router.push('/events')}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        scale: '103%',
                        transition: 'all .5s',
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
                        <AccessTime />
                        <Typography variant="body1">
                          {dayjs(item.date).format('ddd, D MMM, YYYY | HH:mm')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2} my={1}>
                        <LocationOn />
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
                      <Stack direction="row" alignItems="center" spacing={2} my={1}>
                        <EventSeat />
                        <Typography variant="body1"> 50/{item.maxParticipants}</Typography>
                      </Stack>
                      <Button
                        startIcon={<LocationOn />}
                        variant="contained"
                        disabled={item.isCanceled}
                      >
                        Register
                      </Button>
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
