import PageHeader from '@common/components/lib/partials/PageHeader';
import { RHFTextField } from '@common/components/lib/react-hook-form';
import RHFImageDropzone from '@common/components/lib/react-hook-form/RHFImageDropzone';
import CreateCrudItemForm from '@common/components/partials/CreateCrudItemForm';
import Routes from '@common/defs/routes';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import EventsCards from '@modules/events/components/partials/EventsCards';
import { Upload } from '@modules/uploads/defs/types';
import useUploads, { CreateOneInput } from '@modules/uploads/hooks/api/useUploads';
import { NextPage } from 'next';
import Link from 'next/link';
import * as Yup from 'yup';

const Index: NextPage = () => {
  const schema = Yup.object().shape({
    image: Yup.mixed().required('Le champ est obligatoire'),
  });
  const defaultValues: CreateOneInput = {
    file: new File([], ''),
  };
  return (
    <>
      <PageHeader title="Dashboard" />
      <EventsCards filterToolbar fetchItems />
    </>
  );
};

export default withAuth(Index, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
