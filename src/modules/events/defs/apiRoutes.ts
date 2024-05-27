import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/events';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  ReadRegistred: prefix + '/registered/{id}',
  ReadOwn: prefix + '/myevents/{id}',
  UpdateOne: prefix + '/{id}',
  CancelOne: prefix + '/cancel/{id}',
  RestoreOne: prefix + '/restore/{id}',
  RegisterOne: prefix + '/register/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
