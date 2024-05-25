import { RHFSwitch, RHFTextField } from '@common/components/lib/react-hook-form';
import RHFImageDropzone from '@common/components/lib/react-hook-form/RHFImageDropzone';
import UpdateCrudItemForm from '@common/components/partials/UpdateCrudItemForm';
import Routes from '@common/defs/routes';
import { ROLES_OPTIONS } from '@modules/permissions/defs/options';
import { ROLE } from '@modules/permissions/defs/types';
import { User } from '@modules/users/defs/types';
import useUsers, { UpdateOneInput } from '@modules/users/hooks/api/useUsers';
import { Grid, MenuItem } from '@mui/material';
import * as Yup from 'yup';

interface UpdateUserFormProps {
  item: User;
}

const UpdateUserForm = (props: UpdateUserFormProps) => {
  const { item } = props;
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Le format de l'email est incorrect")
      .required('Le champ est obligatoire'),
    password: Yup.string(),
    role: Yup.mixed<ROLE>()
      .oneOf(Object.values(ROLE), (_values) => {
        return `Le champ doit avoir l'une des valeurs suivantes : ${ROLES_OPTIONS.map(
          (option) => option.label
        ).join(', ')}`;
      })
      .required('Le champ est obligatoire'),
  });
  const defaultValues: UpdateOneInput = {
    email: item.email,
    password: '',
    role: item.rolesNames[0],
  };
  return (
    <>
      <UpdateCrudItemForm<User, UpdateOneInput>
        item={item}
        routes={Routes.Users}
        useItems={useUsers}
        schema={schema}
        defaultValues={defaultValues}
      >
        <Grid container spacing={3} sx={{ padding: 6 }}>
          <Grid item xs={6}>
            <RHFTextField name="name" label="Name" />
          </Grid>
          <Grid item xs={6}>
            {/* <RHFDatePicker name="date" label="Date" /> */}
            <RHFTextField name="date" label="Date" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="location" label="Location" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField
              type="number"
              name="maxParticipants"
              label="Maximum Number of Participants"
            />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField multiline rows={6} name="description" label="Description" />
          </Grid>
          <Grid item xs={6}>
            <RHFImageDropzone name="image" label="Image" />
          </Grid>
          <Grid item xs={12}>
            <RHFSwitch name="canceled" label="Canceled" />
          </Grid>
        </Grid>
      </UpdateCrudItemForm>
    </>
  );
};

export default UpdateUserForm;
