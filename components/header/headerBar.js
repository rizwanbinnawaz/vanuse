import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Axios from "axios";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import SignupModal from "../auth/SignupModal";
import LoginModal from "../auth/LoginModal";
import { useDispatch } from "react-redux";

const pages = ["Customers", "Drivers", "For Business", "Contact Us"];

const HeaderBar = (props) => {
  const dispatch = useDispatch();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [showAuth, setShowAuth] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openLoginModal, setOpenLoginModal] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [signupValue, setSignupValue] = React.useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleOpen = () => {
    setOpenLoginModal(false);
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpenLoginModal(false);
    setOpen(false);
  };
  const onLogin = (userName, password) => {
    console.log("onLogin newData", userName, password);
    Axios.post(`http://127.0.0.1:8000/login/`, {
      username: userName,
      password: password,
    })
      .then(function (response) {
        setShowToast(true);
        if (response.status == 200) {
          setSignupValue(false);
          setOpenLoginModal(false);
          dispatch({
            type: "SET_USER_DATA",
            payload: response.data.token,
          });
          localStorage.setItem("token", response.data.token);
        }
      })
      .catch(function (error) {
        console.log(error);
        dispatch({
          type: "SET_UNAUTHORIZED",
        });
      });
  };
  const onSignUp = (email, password, phoneNumber) => {
    Axios.post(`http://127.0.0.1:8000/signup/`, {
      email: email,
      username: email,
      password: password,
      phone_number: "+44 " + phoneNumber,
    })
      .then(function (response) {
        setShowToast(true);
        localStorage.setItem("token", response.data.token);
        setSignupValue(true);
        dispatch({
          type: "SET_USER_DATA",
          payload: response.data.token,
        });
        setOpen(false);
      })
      .catch(function (error) {
        console.log(error);
        dispatch({
          type: "SET_UNAUTHORIZED",
        });
      });
  };

  const LogoutUser = () => {
    setAnchorElNav(null);
    setShowAuth(false);
    localStorage.removeItem("token");
    dispatch({
      type: "SET_UNAUTHORIZED",
    });
  };
  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
    setOpen(false);
  };
  useEffect(() => {
    setShowAuth(props.authorized);
  }, [props.authorized]);

  return (
    <AppBar position="static" className="nav-bar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="header-logo"
            sx={{ mr: 10, display: { xs: "flex", md: "flex" } }}
          >
            <img src="/logo.svg" alt="Logo" className="logo" />
          </Typography>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {showAuth ? (
            <Button
              key={"logout"}
              sx={{ zIndex: "1", display: { xs: "none", md: "block" } }}
              className="darkbutton"
              onClick={LogoutUser}
            >
              Logout
            </Button>
          ) : (
            <Box
              sx={{
                zIndex: "1",
                flexGrow: 0,
                display: { xs: "none", md: "flex" },
              }}
              className="login-buttons"
            >
              <Button key={"login"} onClick={handleOpenLoginModal}>
                Log In
              </Button>
              <Button
                key={"signup"}
                className="darkbutton"
                onClick={handleOpenLoginModal}
              >
                Sign Up
              </Button>
            </Box>
          )}

          <Box
            sx={{
              flexGrow: 0,
              display: {
                xs: "flex",
                md: "none",
                justifyContent: "space-between",
              },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              style={{ zIndex: "1" }}
              className="mobileMenu"
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
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              {showAuth ? (
                <MenuItem key={"user"} onClick={LogoutUser}>
                  Logout
                </MenuItem>
              ) : (
                <Box>
                  <MenuItem
                    key={"login"}
                    onClick={handleOpenLoginModal}
                    sx={{ display: { xs: "block", md: "none" } }}
                  >
                    Log In
                  </MenuItem>
                  <MenuItem
                    key={"signup"}
                    onClick={handleOpenLoginModal}
                    sx={{ display: { xs: "block", md: "none" } }}
                  >
                    Sign Up
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </Box>
        </Toolbar>
        <SignupModal
          open={open}
          onSignUp={onSignUp}
          handleOpenLoginModal={handleOpenLoginModal}
          handleClose={handleCloseModal}
        />
        <LoginModal
          open={openLoginModal}
          onLogin={onLogin}
          handleOpenSignUpModal={handleOpen}
          handleClose={handleCloseModal}
        />
      </Container>
    </AppBar>
  );
};
export default HeaderBar;
