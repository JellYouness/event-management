import PageHeader from '@common/components/lib/partials/PageHeader';
import RHFImageDropzone from '@common/components/lib/react-hook-form/RHFImageDropzone';
import CreateCrudItemForm from '@common/components/partials/CreateCrudItemForm';
import Routes from '@common/defs/routes';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import MyEventsTable from '@modules/myevents/components/partials/MyEventsTable';
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
      {/* <MyEventsTable filterToolbar fetchItems /> */}
      <CreateCrudItemForm<Upload, CreateOneInput>
        routes={Routes.Users}
        useItems={useUploads}
        schema={schema}
        defaultValues={defaultValues}
      >
        <RHFImageDropzone name="file" label="image" />
      </CreateCrudItemForm>
    </>
  );
};

export default withAuth(Index, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
