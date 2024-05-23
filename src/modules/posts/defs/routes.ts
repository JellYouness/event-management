import { CrudRoutes } from '@common/defs/types';

const prefix = '/articles';
const Routes: CrudRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  CreateOne: prefix + '/creer',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default Routes;
