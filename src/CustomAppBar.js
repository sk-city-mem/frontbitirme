import { AppBar, Toolbar, Typography, Button, Box, Stack } from "@mui/material";
import { useAuthContext } from "./AuthProvider";

const CustomAppbar = () => {
  const context = useAuthContext();

  const handleLogout = () => {
    context.updateToken();
    localStorage.removeItem("user");
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
            {context.isLoggedIn && (
              <Button onClick={handleLogout} variant="contained" color="error">
                Çıkış yap
              </Button>
            )}
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppbar;
