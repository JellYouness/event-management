import { CrudRoutes } from '@common/defs/types';

const prefix = '/myevents';
const Routes: CrudRoutes = {
  ReadAll: prefix,
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
};

export default Routes;
