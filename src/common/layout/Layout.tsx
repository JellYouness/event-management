import React, { useState } from 'react';
import Head from 'next/head';
import Footer from './Footer';
import Leftbar, { LEFTBAR_WIDTH } from './Leftbar';
import Topbar from './Topbar';
import Box from '@mui/material/Box';
import { Container, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import usePermissions from '@modules/permissions/hooks/usePermissions';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const { children } = props;
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openLeftbar, setOpenLeftbar] = useState(true);
  //Persmission
  const { can } = usePermissions();
  const permission= {
    entity: Namespaces.Users,
    action: CRUD_ACTION.CREATE,
  };
  //if admin
  const leftBarStyle = can(permission.entity, permission.action) && {
    marginLeft: openLeftbar ? LEFTBAR_WIDTH + 'px' : 0,
    width: openLeftbar ? `calc(100% - ${LEFTBAR_WIDTH}px)` : '100%',
  };
  return (
    <div>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_TITLE}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Box sx={{ minHeight: '100vh', width: '100vw' }}>
          <Stack direction="column" sx={{ height: '100%' }}>
            {can(permission.entity, permission.action) && (
              <Leftbar
                open={openLeftbar}
                onToggle={(open: boolean | ((prevState: boolean) => boolean)) =>
                  setOpenLeftbar(open)
                }
              />
            )}

            <Topbar sx={leftBarStyle} />
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                ...leftBarStyle,
              }}
            >
              <Container
                sx={{
                  flex: 1,
                  paddingY: 6,
                  transition: theme.transitions.create(['all'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                }}
              >
                <Box component="main" sx={{}}>
                  {children}
                </Box>
              </Container>
            </Box>
            <Box
              sx={{
                ...leftBarStyle,
                transition: theme.transitions.create(['all'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
            >
              <Footer />
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
