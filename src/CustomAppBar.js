import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  Dialog,
} from "@mui/material";
import { useAuthContext } from "./AuthProvider";
import { useLocation } from "react-router-dom";
import Login from "./SignIn";
import { useState } from "react";

const CustomAppbar = () => {
  const location = useLocation();
  const context = useAuthContext();
  const [openLogin, setOpenLogin] = useState(false);

  console.log(location);
  const handleLogout = () => {
    context.updateToken();
  };

  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          alignItems="center"
          width="100%"
          paddingX={3}
          paddingY={1}
        >
          <img
            height="70px"
            src="https://www.sakarya.edu.tr/assets/img/sau-logo-dikey.jpg"
          ></img>
          <Typography variant="h4" noWrap margin="auto">
            Sakarya Yerel Gazeteler Veritabanı
          </Typography>
          <Box sx={{ flexGrow: 1 }} display="flex" justifyContent="end">
            {context.isLoggedIn ? (
              <Button onClick={handleLogout} variant="contained" color="error">
                Çıkış yap
              </Button>
            ) : (
              <>
                {location.pathname === "/admin-list" && (
                  <Button onClick={()=>setOpenLogin(true)} variant="contained">
                    Giriş Yap
                  </Button>
                )}
              </>
            )}
          </Box>
        </Stack>
      </Toolbar>
      <Dialog
        maxWidth="lg"
        open={openLogin}
        onClose={() => setOpenLogin(false)}
      >
        <Login />
      </Dialog>
    </AppBar>
  );
};

export default CustomAppbar;
