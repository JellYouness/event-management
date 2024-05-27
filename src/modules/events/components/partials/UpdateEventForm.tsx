import { RHFSwitch, RHFTextField } from '@common/components/lib/react-hook-form';
import RHFImageDropzone from '@common/components/lib/react-hook-form/RHFImageDropzone';
import UpdateCrudItemForm from '@common/components/partials/UpdateCrudItemForm';
import Routes from '@common/defs/routes';
import { Event } from '@modules/events/defs/types';
import { ROLES_OPTIONS } from '@modules/permissions/defs/options';
import { ROLE } from '@modules/permissions/defs/types';
import { User } from '@modules/users/defs/types';
import useEvents, { UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import { Grid, MenuItem } from '@mui/material';
import * as Yup from 'yup';
import dayjs from 'dayjs';

interface UpdateEventFormProps {
  item: Event;
}

const UpdateEventForm = (props: UpdateEventFormProps) => {
  const { item } = props;
  const schema = Yup.object().shape({
    name: Yup.string().required('Le champ est obligatoire'),
    date: Yup.date().required('Le champ est obligatoire'),
    location: Yup.string().required('Le champ est obligatoire'),
    description: Yup.string().required('Le champ est obligatoire'),
    maxParticipants: Yup.number().positive().required('Le champ est obligatoire'),
    image: Yup.string(),
  });
  const defaultValues: UpdateOneInput = {
    name: item.name,
    // @ts-ignore
    date: dayjs(item.date).format('YYYY-MM-DD hh:mm'),
    //date: Dayjs().toDate(),
    location: item.location,
    description: item.description,
    maxParticipants: item.maxParticipants,
    image: item.image,
    isCanceled: item.isCanceled,
  };
  return (
    <>
      <UpdateCrudItemForm<Event, UpdateOneInput>
        item={item}
        routes={Routes.Events}
        useItems={useEvents}
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
            <RHFSwitch name="isCanceled" label="Canceled" />
          </Grid>
        </Grid>
      </UpdateCrudItemForm>
    </>
  );
};

export default UpdateEventForm;
