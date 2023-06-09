import { useState, useRef, useEffect } from "react";
import "./styleDrog.css";
import { Col, Row, Form, Modal, Spinner } from "react-bootstrap";
import { FilePdfFill } from "react-bootstrap-icons";
import axios from "axios";
import SignIn from "./SignIn";
import { useAuthContext } from "./AuthProvider";
import swal from "sweetalert";
import CustomAppbar from "./CustomAppBar";
import {
  TextField,
  Box,
  CardActionArea,
  CardContent,
  Paper,
  Container,
  Card,
  Typography,
  Stack,
  Button,
  Dialog,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { CircularProgress, LinearProgress } from "@mui/material";

const DragDrop = () => {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();
  const [smShow, setSmShow] = useState(false);
  const context = useAuthContext();
  const [name, setName] = useState();
  const [inQueueCount, setInqueueCount] = useState(-1);
  const [lastUploadId, setLastUploadId] = useState(
    localStorage.getItem("last_upload_id")
  );

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const formData = new FormData();

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  const updateLastUploadId = (value) => {
    value
      ? localStorage.setItem("last_upload_id", value)
      : localStorage.removeItem("last_upload_id");
    setLastUploadId(value);
  };

  useEffect(() => {
    statusWatchReqeust(lastUploadId)
    const intervalId = setInterval(() => {
      if (lastUploadId) {
        statusWatchReqeust(lastUploadId)
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastUploadId]);

  const statusWatchReqeust = (lastUploadId) => {
    axios
    .get(
      "http://localhost:3000/pdf-news-doc-orm/find-position-in-queue/" +
        lastUploadId,
      {
        headers: {
          Authorization: `Bearer ${context.token}`,
        },
      }
    )
    .then((res) => setInqueueCount(res.data));
  }
  // send files to the server // learn from my other video
  const handleUpload = () => {
    console.log(formData.getAll());
    // fetch(
    //   "link", {
    //     method: "POST",
    //     body: formData
    //   }
    // )
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
  const sendUploadRequest = async () => {
    try {
      if (!name || !files) {
        return swal("Uyarı", "Lütfen Gazete Girin", "warning");
      }

      console.log(files);
      for (var i = 0; i < files.length; i++) {
        await uploadRequest(files[i]);
      }
    } catch (err) {
      console.log("heres", err);
      context.updateToken();
    }
  };

  const uploadRequest = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("file", file);
    formData.append("name", name);
    const res = await axios.post(
      "http://localhost:3000/pdf-news-doc-orm/upload/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${context.token}`,
          "Content-Type": "multipart/form-data" 
          
        },
      }
    );
    updateLastUploadId(res.data.id);
  };

  const token = localStorage.getItem("accessToken");
  // if(!token) {
  //   return <SignIn />
  // }
  return (
    <>
      <CustomAppbar />
      <Container maxWidth="md" flexGrow>
        <Box
          display="flex"
          sx={{ marginTop: 2, justifyContent: "center", alignSelf: "center" }}
        >
          <form>
            <Typography variant="h5" fontWeight="bold">Gazete Yükle:</Typography>
            <Stack spacing={2} alignItems="center">
              <Box>
                <TextField
                  fullWidth
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  variant="filled"
                  label="Gazete İsmi"
                  required
                />
              </Box>
              {files?.length > 0 && (
                <Card display="inline-flex" component={Box} width="100%" variant="outlined" sx={{borderRadius:3}}>
                  <Box maxHeight={200} overflow="auto" flexGrow={1}>
                    <ol>
                      {Array.from(files || []).map((file, idx) => (
                        <>
                        <li key={idx}>
                          <FilePdfFill color="red" size={40}></FilePdfFill>
                          {file.name}
                        </li>
                        <Divider/>
                        </>
                      ))}
                    </ol>
                  </Box>

                  <Button
                    onClick={() => setFiles(null)}
                    variant="contained"
                    color="error"
                  >
                    Temizle
                  </Button>
                </Card>
              )}
              <Card
                onClick={() => inputRef.current.click()}
                sx={{
                  border: "6px dashed black",
                  borderRadius: 3,
                  borderColor: "",
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                variant="outlined"
              >
                <CardActionArea>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="center"
                      marginBottom={4}
                    >
                      <UploadFileIcon sx={{ fontSize: 80 }} color="primary" />
                    </Box>
                    <Typography variant="h5">
                      Dosyaları Yüklemek İçin Sürükle ve Bırak veya Tıklayın
                    </Typography>

                    <input
                      type="file"
                      multiple
                      onChange={(event) => setFiles(event.target.files)}
                      hidden
                      accept="application/pdf"
                      ref={inputRef}
                    />
                    {/* <button onClick={() => inputRef.current.click()}>Select Files</button> */}
                    <Typography fontStyle="italic">
                      {" "}
                      {inQueueCount !== -1 && (
                        <>
                          
                          <LinearProgress/>

                          {" " +
                            (inQueueCount + 1) +
                            " elements in process queue"}
                        </>
                      )}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Button onClick={sendUploadRequest} variant="contained" size="large">
                Yükle
              </Button>
            </Stack>
            <Dialog maxWidth="lg" open={!context.isLoggedIn}>
              <SignIn />
            </Dialog>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default DragDrop;
