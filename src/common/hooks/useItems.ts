import { useState, useEffect } from 'react';
import useSWRImmutable, { KeyedMutator } from 'swr';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import { Any, CrudApiRoutes, Id } from '@common/defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';

export type ItemsData<Item> = { items: Item[] };
export type ItemData<Item> = { item: Item };
export type ItemsResponse<Item> = ApiResponse<ItemsData<Item>>;
export type ItemResponse<Item> = ApiResponse<ItemData<Item>>;

export interface UseItemsHook<Item, CreateOneInput, UpdateOneInput> {
  items: Item[] | null;
  createOne: (_input: CreateOneInput, options?: FetchApiOptions) => Promise<ItemResponse<Item>>;
  readOne: (id: Id, options?: FetchApiOptions) => Promise<ItemResponse<Item>>;
  readAll: (options?: FetchApiOptions) => Promise<ItemsResponse<Item>>;
  readOwn: (id: Id, options?: FetchApiOptions) => Promise<ItemsResponse<Item>>;
  readRegistred: (id: Id, options?: FetchApiOptions) => Promise<ItemsResponse<Item>>;
  updateOne: (
    id: Id,
    _input: UpdateOneInput,
    options?: FetchApiOptions
  ) => Promise<ItemResponse<Item>>;
  cancelOne: (id: Id, options?: FetchApiOptions) => Promise<ItemResponse<Item>>;
  restoreOne: (id: Id, options?: FetchApiOptions) => Promise<ItemResponse<Item>>;
  registerOne: (id: Id, input: any, options?: FetchApiOptions) => Promise<ItemResponse<Item>>;
  deleteOne: (id: Id, options?: FetchApiOptions) => Promise<ItemResponse<Item>>;
  mutate: KeyedMutator<Item[] | null>;
}

export interface UseItemsOptions {
  fetchItems?: boolean;
  fetchOwnItems?: boolean;
  fetchRegistredItems?: boolean;
}
export const defaultOptions = {
  fetchItems: false,
  fetchOwnItems: false,
  fetchRegistredItems: false,
};

export type UseItems<Item, CreateOneInput = Any, UpdateOneInput = Any> = (
  opts?: UseItemsOptions
) => UseItemsHook<Item, CreateOneInput, UpdateOneInput>;

const useItems = <Item, CreateOneInput, UpdateOneInput>(
  apiRoutes: CrudApiRoutes,
  opts: UseItemsOptions = defaultOptions
): UseItemsHook<Item, CreateOneInput, UpdateOneInput> => {
  const fetchApi = useApi();
  const { user } = useAuth();
  const id = user?.id ?? 0;

  const mode = opts.fetchItems
    ? apiRoutes.ReadAll
    : null || opts.fetchOwnItems
    ? apiRoutes.ReadOwn.replace('{id}', id.toString())
    : null || opts.fetchRegistredItems
    ? apiRoutes.ReadRegistred.replace('{id}', id.toString())
        : null;
  
  const read = () => {
    if (opts.fetchOwnItems) return readOwn(id);
    if (opts.fetchRegistredItems) return readRegistred(id);
    return readAll();
  }
  
  const { data, mutate } = useSWRImmutable<Item[] | null>(
    mode,
    async (_url: string) => {
      const response = await read();
      return response.data?.items ?? null;
    }
  );

  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    setItems(data ?? null);
  }, [data]);

  const createOne = async (input: CreateOneInput, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(apiRoutes.CreateOne, {
      method: 'POST',
      body: input,
      ...options,
    });

    if (response.success) {
      mutate();
    }

    return response;
  };

  const readOne = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(
      apiRoutes.ReadOne.replace('{id}', id.toString()),
      options
    );

    return response;
  };

  const readAll = async (options?: FetchApiOptions) => {
    const response = await fetchApi<ItemsData<Item>>(apiRoutes.ReadAll, options);

    if (response.success) {
      setItems(response.data?.items ?? null);
    }

    return response;
  };

  const readOwn = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemsData<Item>>(
      apiRoutes.ReadOwn.replace('{id}', id.toString()),
      options
    );

    return response;
  };

  const readRegistred = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemsData<Item>>(
      apiRoutes.ReadRegistred.replace('{id}', id.toString()),
      options
    );

    return response;
  };

  const updateOne = async (id: Id, input: UpdateOneInput, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(
      apiRoutes.UpdateOne.replace('{id}', id.toString()),
      {
        method: 'PUT',
        body: input,
        ...options,
      }
    );

    if (response.success) {
      mutate();
    }

    return response;
  };

  const cancelOne = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(
      apiRoutes.CancelOne.replace('{id}', id.toString()),
      {
        method: 'PUT',
        ...options,
      }
    );

    if (response.success) {
      mutate();
    }

    return response;
  };

  const restoreOne = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(
      apiRoutes.RestoreOne.replace('{id}', id.toString()),
      {
        method: 'PUT',
        ...options,
      }
    );

    if (response.success) {
      mutate();
    }

    return response;
  };

  const registerOne = async (id: Id, input: any, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(
      apiRoutes.RegisterOne.replace('{id}', id.toString()),
      {
        method: 'POST',
        body: input,
        ...options,
      }
    );

    if (response.success) {
      mutate();
    }

    return response;
  };

  const deleteOne = async (id: Id, options?: FetchApiOptions) => {
    const response = await fetchApi<ItemData<Item>>(
      apiRoutes.DeleteOne.replace('{id}', id.toString()),
      {
        method: 'DELETE',
        ...options,
      }
    );

    if (response.success) {
      mutate();
    }

    return response;
  };

  return {
    items,
    createOne,
    readOne,
    readAll,
    readOwn,
    readRegistred,
    updateOne,
    cancelOne,
    restoreOne,
    registerOne,
    deleteOne,
    mutate,
  };
};

export default useItems;
