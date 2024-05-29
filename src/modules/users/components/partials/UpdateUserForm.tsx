import { RHFSelect, RHFTextField } from '@common/components/lib/react-hook-form';
import UpdateCrudItemForm from '@common/components/partials/UpdateCrudItemForm';
import Namespaces from '@common/defs/namespaces';
import Routes from '@common/defs/routes';
import { CRUD_ACTION } from '@common/defs/types';
import { ItemResponse } from '@common/hooks/useItems';
import { ROLES_OPTIONS } from '@modules/permissions/defs/options';
import { ROLE } from '@modules/permissions/defs/types';
import usePermissions from '@modules/permissions/hooks/usePermissions';
import { User } from '@modules/users/defs/types';
import useUsers, { UpdateOneInput } from '@modules/users/hooks/api/useUsers';
import { Grid, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';

interface UpdateUserFormProps {
  item: User;
}

const UpdateUserForm = (props: UpdateUserFormProps) => {
  const router = useRouter();
  const { can } = usePermissions();
  const { item } = props;
  const schema = Yup.object().shape({
    name: Yup.string().required('The field is required'),
    email: Yup.string().email('Email format is incorrect').required('The field is required'),
    password: Yup.string(),
    role: Yup.mixed<ROLE>()
      .oneOf(Object.values(ROLE), (_values) => {
        return `The field must have one of the following values : ${ROLES_OPTIONS.map(
          (option) => option.label
        ).join(', ')}`;
      })
      .required('The field is required'),
  });
  const defaultValues: UpdateOneInput = {
    name: item.name,
    email: item.email,
    password: '',
    role: item.rolesNames[0],
  };

  const onPostSubmit = async (
    _data: UpdateOneInput,
    response: ItemResponse<User>,
    _methods: UseFormReturn<UpdateOneInput>
  ) => {
    if (response.success) {
      router.push(Routes.Users.ReadAll);
    }
  };
  return (
    <>
      <UpdateCrudItemForm<User, UpdateOneInput>
        item={item}
        routes={Routes.Users}
        useItems={useUsers}
        schema={schema}
        defaultValues={defaultValues}
        onPostSubmit={onPostSubmit}
      >
        <Grid container spacing={3} sx={{ padding: 6 }}>
          <Grid item xs={6}>
            <RHFTextField name="name" label="Name" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="email" label="Email" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="password" label="Password" type="password" />
          </Grid>
          {can(Namespaces.Events, CRUD_ACTION.UPDATE) && (
            <Grid item xs={6}>
              <RHFSelect name="role" label="Role">
                {ROLES_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
          )}
        </Grid>
      </UpdateCrudItemForm>
    </>
  );
};

export default UpdateUserForm;
