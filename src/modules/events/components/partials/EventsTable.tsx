import Routes from '@common/defs/routes';
import ItemsTable from '@common/components/partials/ItemsTable';
import useEvents, { CreateOneInput, UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';
import { Event } from '@modules/events/defs/types';

interface Row extends CrudRow {
  name: string;
  date: Date;
  location: string;
  image: string;
}

const EventsTable = () => {
  const columns: GridColumns<Row> = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'dateTime',
      flex: 1,
      renderCell: (params) => dayjs(params.row.date).format('DD/MM/YYYY hh:mm'),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
    },
    {
      field: 'image',
      headerName: 'Image',
      flex: 1,
    },
  ];

  const itemToRow = (item: Event): Row => {
    return {
      id: item.id,
      name: item.name,
      date: item.date,
      location: item.location,
      image: item.image,
    };
  };

  return (
    <>
      <ItemsTable<Event, CreateOneInput, UpdateOneInput, Row>
        namespace={Namespaces.Events}
        routes={Routes.Events}
        useItems={useEvents}
        columns={columns}
        itemToRow={itemToRow}
      />
    </>
  );
};

export default EventsTable;
