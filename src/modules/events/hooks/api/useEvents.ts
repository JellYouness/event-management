import ApiRoutes from '@common/defs/apiRoutes';
import { Event } from '@modules/events/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';

export interface CreateOneInput {
  name: string;
  date: Date;
  location: string;
  image: string;
  description: string;
  maxParticipants: number;
}

export interface UpdateOneInput {
  name: string;
  date: Date;
  location: string;
  image: string;
  description: string;
  maxParticipants: number;
  isCanceled: boolean;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useEvents: UseItems<Event, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Events;
  const useItemsHook = useItems<Event, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useEvents;
