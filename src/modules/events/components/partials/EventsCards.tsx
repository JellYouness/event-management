import Routes from '@common/defs/routes';
import useEvents, { CreateOneInput, UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';
import { Event } from '@modules/events/defs/types';
import ItemsCards from '@common/components/partials/ItemsCards';

export interface Row extends CrudRow {
  name: string;
  date: Date;
  location: string;
  isCanceled: boolean;
  image: string;
  maxParticipants: number;
  userId: number;
  participants: number;
}

interface EventsCardsProps {
  fetchItems?: boolean;
  ownItems?: boolean;
  registredtems?: boolean;
  filterToolbar?: boolean;
}

const EventsCards = (props: EventsCardsProps) => {
  const {fetchItems, ownItems, filterToolbar, registredtems } = props;
  const itemToRow = (item: Event): Row => {
    return {
      id: item.id,
      name: item.name,
      date: item.date,
      location: item.location,
      isCanceled: item.isCanceled,
      image: item.image,
      maxParticipants: item.maxParticipants,
      userId: item.userId,
      participants: item.participants,
    };
  };

  return (
    <>
      <ItemsCards<Event, CreateOneInput, UpdateOneInput, Row>
        namespace={Namespaces.Events}
        routes={Routes.Events}
        useItems={useEvents}
        itemToRow={itemToRow}
        fetchItems={fetchItems}
        ownItems={ownItems}
        registredtems={registredtems}
        filterToolbar={filterToolbar}
      />
    </>
  );
};

export default EventsCards;
