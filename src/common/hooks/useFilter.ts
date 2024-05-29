import { Row } from '@modules/events/components/partials/EventsCards';
import dayjs from 'dayjs';
import { useState } from 'react';

const useFilter = () => {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState('');
  const [eventStatus, setEventStatus] = useState('all');
  const [activityStatus, setActivityStatus] = useState('all');
  const [notFull, setNotFull] = useState(false);

  return {
    search,
    date,
    location,
    eventStatus,
    activityStatus,
    notFull,
    //
    setSearch,
    setDate,
    setLocation,
    setEventStatus,
    setActivityStatus,
    setNotFull,
  };
};

export default useFilter;
