import ApiRoutes from '@common/defs/apiRoutes';
import { ROLE } from '@modules/permissions/defs/types';
import { User } from '@modules/users/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';

export interface CreateOneInput {
  name: string;
  email: string;
  password: string;
  role: ROLE;
}

export interface UpdateOneInput {
  name: string;
  email: string;
  password?: string;
  role: ROLE;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useUsers: UseItems<User, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Users;
  const useItemsHook = useItems<User, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useUsers;
