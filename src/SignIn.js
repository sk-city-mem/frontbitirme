import axios from "axios";
import { useState } from "react";
import swal from "sweetalert";
import { useAuthContext } from "./AuthProvider";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  DialogContent,
  Box,
} from "@mui/material";
import { Card } from "react-bootstrap";

export default function Login() {
  const context = useAuthContext();
  const [name, setName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:3000/auth/login", {
      username: name,
      password,
    });
    if ("access_token" in response.data) {
      swal("Success", "Login Successfull", "success", {
        buttons: false,
        timer: 2000,
      }).then((value) => {
        context.updateToken(response.data.access_token);
      });
    } else {
      swal("Failed", response.message, "error");
    }
  };
  // useEffect(() => {
  //   getData()
  //    }, []);
  //    const getData = async () => {
  //      const url = "api endpoint";
  //      try {
  //      const response = await axios.get(url, config);
  //      console.log(response.data);
  //      if (response.status === 200) {
  //        console.log(response.data);
  //      }
  //      else{
  //        console.log("hata var");
  //      }
  //      }
  //      catch (error) {
  //        console.log(error);
  //      }
  //      };
  return (
    <DialogContent>
      <Box minWidth={400}></Box>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="h4" textAlign="center" fontWeight="bold">
            Yönetici Girişi
          </Typography>
          <TextField
            fullWidth
            onChange={(e) => setName(e.target.value)}
            value={name}
            variant="filled"
            label="İsim"
          />

          <TextField
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            variant="filled"
            label="Şifre"
          />
          <div className="d-grid">
            <Button variant="contained" size="large" type="submit">
              Giriş
            </Button>
          </div>
        </Stack>
      </form>
    </DialogContent>
  );
}
