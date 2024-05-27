import { CrudRoutes } from '@common/defs/types';

const prefix = '/events';
const Routes: CrudRoutes = {
  ReadAll: prefix,
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
  Registered: prefix + '/registered',
};

export default Routes;
