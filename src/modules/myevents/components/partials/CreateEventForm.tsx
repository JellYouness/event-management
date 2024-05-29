import { RHFSelect, RHFSwitch, RHFTextField } from '@common/components/lib/react-hook-form';
import CreateCrudItemForm from '@common/components/partials/CreateCrudItemForm';
import Routes from '@common/defs/routes';
import { ItemResponse } from '@common/hooks/useItems';
import { ROLES_OPTIONS } from '@modules/permissions/defs/options';
import { ROLE } from '@modules/permissions/defs/types';
import { Event } from '@modules/events/defs/types';
import useEvents, { CreateOneInput } from '@modules/events/hooks/api/useEvents';
import { Grid, InputLabel, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';
import RHFDatePicker from '@common/components/lib/react-hook-form/RHFDatePicker';
import RHFImageDropzone from '@common/components/lib/react-hook-form/RHFImageDropzone';
import { Label } from '@mui/icons-material';
import dayjs from 'dayjs';

interface CreateEventFormProps {}

const CreateEventForm = (_props: CreateEventFormProps) => {
  const router = useRouter();
  const schema = Yup.object().shape({
    name: Yup.string().required('The field is required'),
    date: Yup.date().required('The field is required'),
    location: Yup.string().required('The field is required'),
    description: Yup.string().required('The field is required'),
    maxParticipants: Yup.number().positive().required('The field is required'),
    image: Yup.string()
  });
  const defaultValues: CreateOneInput = {
    name: '',
    date: new Date(), 
    //date: new Dayjs().toDate(), 
    location: '',
    description: '',
    maxParticipants: 0,
    image: '',
  };
  const onPostSubmit = async (
    _data: CreateOneInput,
    response: ItemResponse<Event>,
    _methods: UseFormReturn<CreateOneInput>
  ) => {
    if (response.success) {
      router.push(Routes.Events.ReadAll);
    }
  };
  return (
    <>
      <CreateCrudItemForm<Event, CreateOneInput>
        routes={Routes.Events}
        useItems={useEvents}
        schema={schema}
        defaultValues={defaultValues}
        onPostSubmit={onPostSubmit}
      >
        <Grid container spacing={3} sx={{ padding: 6 }}>
          <Grid item xs={6}>
            <RHFTextField name="name" label="Name" />
          </Grid>
          <Grid item xs={6}>
            <RHFDatePicker name="date" label="Date" />
            {/* <RHFTextField name="date" label="Date" /> */}
          </Grid>
          <Grid item xs={6}>
            {/* <InputLabel>Location</InputLabel> */}
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
          <Grid item xs={2} sx={{mx: 'auto'}}>
            <RHFSwitch name="canceled" label="Canceled" />
          </Grid>
        </Grid>
      </CreateCrudItemForm>
    </>
  );
};

export default CreateEventForm;
