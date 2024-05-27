import Routes from '@common/defs/routes';
import ItemsTable from '@common/components/partials/ItemsTable';
import useEvents, { CreateOneInput, UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';
import { Event } from '@modules/events/defs/types';
import { AccessTime, EventSeat, FiberManualRecord, LocationOn } from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import ItemsCards from '@common/components/partials/ItemsCards';

export interface Row extends CrudRow {
  name: string;
  date: Date;
  location: string;
  isCanceled: boolean;
  image: string;
  maxParticipants: number;
}

interface MyEventsTableProps {
  ownItems?: boolean;
  filterToolbar?: boolean;
}

const MyEventsTable = (props: MyEventsTableProps) => {
  const { ownItems, filterToolbar } = props;
  const itemToRow = (item: Event): Row => {
    return {
      id: item.id,
      name: item.name,
      date: item.date,
      location: item.location,
      isCanceled: item.isCanceled,
      image: item.image,
      maxParticipants: item.maxParticipants,
    };
  };

  return (
    <>
      <ItemsCards<Event, CreateOneInput, UpdateOneInput, Row>
        namespace={Namespaces.Events}
        routes={Routes.Events}
        useItems={useEvents}
        itemToRow={itemToRow}
        ownItems={ownItems}
        filterToolbar={filterToolbar}
      />
    </>
  );
};

export default MyEventsTable;
