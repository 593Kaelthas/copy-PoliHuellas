import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Skeleton,
  Tabs,
  Tab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Routes from "../constants/routes";
import { SESSION_STATE, useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { listtenNotifications } from "@/lib/notifications";
import Notification from "./Notification";

const menuItems = [
  {
    title: "Inicio",
    to: Routes.HOME,
  },
  {
    title: "Adopciones",
    to: Routes.ADOPTIONS,
  },
  {
    title: "Perros",
    to: Routes.DOGS,
  },
  {
    title: "Gatos",
    to: Routes.CATS,
  },
  {
    title: "Otros",
    to: Routes.OTHER,
  },
  {
    title: "¿Cómo adoptar?",
    to: Routes.INSTRUCTIONS,
  },
  {
    title: "Dar en adopción",
    to: Routes.GIVE_PET,
  },
];

export default function ResponsiveAppBar(props) {
  const { currentUser, logout, session } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    if (currentUser != null) {
      const cb = (snapshot) => {
        const notis = snapshot.docs
        setNotifications(notis.map(doc => ({ ...doc.data(), id: doc.id })))
      }
      const unsub = listtenNotifications({ receiverId: currentUser?.uid, callback: cb });
      return () => unsub();
    }
  }, [currentUser]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    handleCloseNavMenu();
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
    handleCloseNavMenu();
  }

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
  };

  const router = useRouter();
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href={Routes.HOME} passHref>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              POLI HUELLAS
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
              autoFocus
            >
              {menuItems.map((item) => (
                <Link href={item.to} key={item.title}>
                  <MenuItem key={item.title} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{item.title}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: { xs: "1rem", md: "2rem" },
            }}
          >
            POLI HUELLAS
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex", justifyContent: "center" },
              mx: 3,
            }}
          >
            <Tabs
              value={router.pathname}
              textColor="secondary"
              indicatorColor="secondary"
            >
              {menuItems.map((item, index) => (
                <Tab
                  onClick={() => router.push(item.to)}
                  key={item.to}
                  value={item.to}
                  label={item.title}
                  sx={{ my: 1, color: "white", display: "block" }}
                  tabIndex={index}
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Notifications">
              {session ? (
                <IconButton onClick={handleOpenNotificationsMenu} sx={{ p: 0, width:"40px", height:"40px", marginRight:"10px", background:"#C2C6CC", color:"#FFFFFF" }}>
                  <NotificationsIcon />
                </IconButton>
              ) : session === SESSION_STATE.NO_LOGGED ? (
                <p/>
              ) : (
                <Skeleton variant="circular" width={40} height={40} />
              )}
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElNotifications}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotificationsMenu}
            >
              {notifications.map((noti) => (
                <Notification key={noti.id} notification={noti} />
              ))}
            </Menu>

            <Tooltip title="Open settings">
              {session ? (
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="avatar-user" src={`${currentUser?.photoURL}`} />
                </IconButton>
              ) : session === SESSION_STATE.NO_LOGGED ? (
                <Link href={Routes.LOGIN}>
                  <Button variant="contained" sx={{m: '0.3rem'}}>Iniciar sesión</Button>
                </Link>
              ) : (
                <Skeleton variant="circular" width={40} height={40} />
              )}
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Link href={`/perfil-de-usuario/${session?.uid}`}>
                <MenuItem onClick={handleCloseUserMenu}>Perfil</MenuItem>
              </Link>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
