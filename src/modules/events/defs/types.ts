import { CrudObject } from '@common/defs/types';
import { ROLE } from '@modules/permissions/defs/types';

export interface Event extends CrudObject {
  name: string;
  date: Date;
  location: string;
  description: string;
  maxParticipants: number;
  image: string;
  isCanceled: boolean;
  participants: number;
  user?: {
    name: string;
  };
}
