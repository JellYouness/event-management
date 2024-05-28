import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Routes from '@common/defs/routes';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Stack from '@mui/material/Stack';
import Logo from '@common/assets/svgs/Logo';
import { AccountCircle, ArrowForwardIos } from '@mui/icons-material';

interface TopbarItem {
  label: string;
  link?: string;
  onClick?: () => void;
  dropdown?: Array<{
    label: string;
    link?: string;
  }>;
}

const Topbar = ({ sx }: any) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openProfile = Boolean(anchorEl);

  const { user, logout } = useAuth();
  const theme = useTheme();

  const dropdownWidth = 137;
  const toggleSidebar = () => {
    setShowDrawer((oldValue) => !oldValue);
  };
  const navItems: TopbarItem[] = [
    {
      label: 'Home',
      link: Routes.Common.Home,
      onClick: () => router.push(Routes.Common.Home),
    },
    {
      label: 'Registred Events',
      link: Routes.Events.Registered,
      onClick: () => router.push(Routes.Events.Registered),
    },
    {
      label: 'My Events',
      link: Routes.MyEvents.ReadAll,
      onClick: () => router.push(Routes.MyEvents.ReadAll),
    },
  ];

  const toggleDropdown = () => {
    setShowDropdown((oldValue) => !oldValue);
  };

  const onNavButtonClick = (item: TopbarItem) => {
    if (item.dropdown) {
      return toggleDropdown;
    }
    return () => {
      setShowDrawer(false);
      if (item.onClick) {
        item.onClick();
      }
    };
  };

  const router = useRouter();
  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: (theme) => theme.customShadows.z1,
        backgroundColor: 'common.white',
        transition: (theme) =>
          theme.transitions.create(['all'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...sx,
      }}
    >
      <Container>
        <Toolbar sx={{ px: { xs: 0, sm: 0 } }}>
          <Stack flexDirection="row" alignItems="center" flexGrow={1}>
            <Logo
              id="topbar-logo"
              onClick={() => router.push(Routes.Common.Home)}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
          <List sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <>
              {navItems.map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    sx={{
                      width: 'fit-content',
                    }}
                  >
                    <StyledListItemButton
                      sx={{
                        ...(router.pathname === item.link && {
                          color: 'primary.main',
                        }),
                        ...(item.dropdown && {
                          borderTopLeftRadius: 24,
                          borderTopRightRadius: 24,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          width: dropdownWidth,
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            boxShadow: (theme) => theme.customShadows.z12,
                            '.MuiTypography-root': {
                              fontWeight: 'bold',
                            },
                            '.dropdown-menu': {
                              visibility: 'visible',
                            },
                            '.MuiTouchRipple-child': {
                              backgroundColor: 'transparent',
                            },
                          },
                        }),
                      }}
                      onClick={onNavButtonClick(item)}
                    >
                      {!item.dropdown ? (
                        <>{item.label}</>
                      ) : (
                        <>
                          <ListItemText>{item.label}</ListItemText>
                          <KeyboardArrowDown />
                          <List
                            className="dropdown-menu"
                            sx={{
                              backgroundColor: 'common.white',
                              boxShadow: (theme) => theme.customShadows.z12,
                              position: 'absolute',
                              top: 48,
                              left: 0,
                              padding: 0,
                              width: dropdownWidth,
                              borderBottomLeftRadius: 24,
                              borderBottomRightRadius: 24,
                              visibility: 'hidden',
                              zIndex: 1000000,
                            }}
                          >
                            {item.dropdown.map((dropdownItem, dropdownItemIndex) => {
                              return (
                                <ListItem
                                  key={dropdownItemIndex}
                                  sx={{
                                    padding: 0,
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      display: 'flex',
                                      gap: 1,
                                      paddingX: 2,
                                      paddingY: 1.5,
                                      borderRadius: 0,
                                      zIndex: 1000000,
                                      '&:hover': {
                                        backgroundColor: 'primary.dark',
                                        color: 'primary.contrastText',
                                      },
                                      ...(item.dropdown?.length === dropdownItemIndex + 1 && {
                                        borderBottomLeftRadius: 24,
                                        borderBottomRightRadius: 24,
                                      }),
                                    }}
                                    onClick={onNavButtonClick(dropdownItem)}
                                  >
                                    {dropdownItem.label}
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        </>
                      )}
                    </StyledListItemButton>
                  </ListItem>
                );
              })}
            </>
            {!user ? (
              <>
                <ListItem
                  sx={{
                    width: 'fit-content',
                  }}
                >
                  <StyledListItemButton
                    onClick={() => router.push(Routes.Auth.Login)}
                    sx={{
                      ...(router.pathname === Routes.Auth.Login && {
                        color: 'primary.main',
                      }),
                    }}
                  >
                    Login
                  </StyledListItemButton>
                </ListItem>
                <ListItem
                  sx={{
                    width: 'fit-content',
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={
                      <ArrowForwardIos
                        fontSize="small"
                        className="arrow-icon"
                        sx={{ fontSize: '12px', transition: 'all, 0.15s' }}
                      />
                    }
                    onClick={() => router.push(Routes.Auth.Register)}
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      '&:hover': {
                        '.arrow-icon': {
                          transform: 'translateX(0.25rem)',
                        },
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </ListItem>
              </>
            ) : (
              <>
                <Stack
                  component="button"
                  direction="row"
                  alignItems="center"
                  sx={{
                    padding: theme.spacing(1, 1.5),
                    borderRadius: theme.shape.borderRadius * 1.5 + 'px',
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                  aria-controls={openProfile ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openProfile ? 'true' : undefined}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                    setAnchorEl(event.currentTarget)
                  }
                >
                  <AccountCircle fontSize="large" color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      {user.name}
                    </Typography>
                  </Box>
                </Stack>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openProfile}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem>
                    <Button
                      onClick={() =>
                        router.push(Routes.Users.UpdateOne.replace('{id}', user.id.toString()))
                      }
                    >
                      Edit Profile
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button onClick={() => logout()}>Log Out</Button>
                  </MenuItem>
                </Menu>
              </>
            )}
          </List>
          <IconButton
            onClick={() => toggleSidebar()}
            sx={{
              display: { md: 'none', sm: 'flex' },
            }}
          >
            <MenuIcon fontSize="medium" sx={{ color: 'grey.700' }} />
          </IconButton>
        </Toolbar>
      </Container>
      <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontWeight: 700,
            width: 250,
          }}
        >
          <Box
            sx={{
              padding: 4,
              '.topbar-logo': {
                width: '250px',
              },
            }}
          >
            <Logo id="responsive-topbar-logo" />
          </Box>
          {navItems.map((item, index) => {
            return (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  ...(item.dropdown && {
                    display: 'flex',
                    flexDirection: 'column',
                  }),
                }}
              >
                <ListItemButton
                  onClick={!item.dropdown ? onNavButtonClick(item) : toggleDropdown}
                  sx={{
                    width: '100%',
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      ...(router.pathname === item.link && {
                        color: 'primary.main',
                      }),
                    }}
                  >
                    {item.label}
                  </ListItemText>
                  {item.dropdown && (
                    <ListItemIcon color="grey.800" sx={{ minWidth: 'unset' }}>
                      <KeyboardArrowDown sx={{ color: 'grey.800' }} />
                    </ListItemIcon>
                  )}
                </ListItemButton>
                {item.dropdown && (
                  <List
                    sx={{
                      width: '100%',
                      transition: 'all, 0.2s',
                      height: 0,
                      paddingY: 0,
                      ...(showDropdown && {
                        height: `calc(${item.dropdown.length} * 48px)`,
                      }),
                    }}
                    className="dropdown-list"
                  >
                    {item.dropdown.map((dropdownItem, dropdownItemIndex) => {
                      return (
                        <ListItem
                          key={dropdownItemIndex}
                          sx={{
                            padding: 0,
                            visibility: 'hidden',
                            ...(showDropdown && {
                              visibility: 'visible',
                            }),
                          }}
                        >
                          <ListItemButton
                            onClick={onNavButtonClick(dropdownItem)}
                            sx={{
                              display: 'flex',
                              gap: 1,
                              paddingLeft: 4,
                            }}
                          >
                            <ListItemText>{dropdownItem.label}</ListItemText>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </ListItem>
            );
          })}

          {!user ? (
            <>
              <ListItem
                disablePadding
                sx={{
                  backgroundColor: 'transparent',
                  marginBottom: 3,
                }}
              >
                <ListItemButton
                  onClick={() => {
                    setShowDrawer(false);
                    router.push(Routes.Auth.Login);
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      ...(router.pathname === Routes.Auth.Login && {
                        color: 'primary.main',
                      }),
                    }}
                  >
                    Connexion
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Button
                variant="contained"
                endIcon={
                  <ArrowForwardIos
                    fontSize="small"
                    className="arrow-icon"
                    sx={{ fontSize: '12px', transition: 'all, 0.15s' }}
                  />
                }
                onClick={() => {
                  setShowDrawer(false);
                  router.push(Routes.Auth.Register);
                }}
                sx={{
                  display: 'flex',
                  flex: 1,
                  width: 150,
                  '&:hover': {
                    '.arrow-icon': {
                      transform: 'translateX(0.25rem)',
                    },
                  },
                }}
              >
                Inscription
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setShowDrawer(false);
                  logout();
                }}
                sx={{
                  display: 'flex',
                }}
              >
                Se déconnecter
              </Button>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.grey[700],
  borderRadius: theme.shape.borderRadius + 'px',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '.MuiTouchRipple-child': {
    backgroundColor: theme.palette.primary.main,
  },
}));
export default Topbar;
