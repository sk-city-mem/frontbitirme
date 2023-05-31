import { useState, useRef, useEffect } from "react";
import "./styleDrog.css";
import {
  Col,
  Button,
  Row,
  Container,
  Card,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import { FilePdfFill } from "react-bootstrap-icons";
import axios from "axios";
import SignIn from "./SignIn";
import { useAuthContext } from "./AuthProvider";
import swal from "sweetalert";

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
    const intervalId = setInterval(() => {
      if (lastUploadId) {
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
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastUploadId]);

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
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${context.token}`,
        },
      }
    );
    updateLastUploadId(res.data.id);
  };

  const handleLogout = () => {
    context.updateToken()
    localStorage.removeItem("user");
  };

  const token = localStorage.getItem("accessToken");
  // if(!token) {
  //   return <SignIn />
  // }
  return (
    <>
      <Form>
        <div className="actions">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Gazete İsmi</Form.Label>
            <Form.Control
              type="text"
              placeholder="Newspaper Name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <>
            <div className="uploads">
              <ol>
                {Array.from(files || []).map((file, idx) => (
                  <li key={idx}>
                    <FilePdfFill color="red" size={40}></FilePdfFill>
                    {file.name}
                  </li>
                ))}
              </ol>
              <div className="actions">
                <Button onClick={() => setFiles(null)} variant="danger">
                  İptal
                </Button>
                <Button onClick={sendUploadRequest} variant="success">
                  Yükle
                </Button>
                <Button onClick={handleLogout} variant="danger">
                  Çıkış yap
                </Button>
              </div>
            </div>
          </>

          <>
            <div
              className="dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <h1>Dosyaları Yüklemek İçin Sürükle ve Bırak</h1>
              <h1>Veya</h1>
              <input
                type="file"
                multiple
                onChange={(event) => setFiles(event.target.files)}
                hidden
                accept="application/pdf"
                ref={inputRef}
              />
              <Button
                onClick={() => inputRef.current.click()}
                variant="primary"
              >
                Dosyaları Seç
              </Button>
              {/* <button onClick={() => inputRef.current.click()}>Select Files</button> */}
              <h6>
                {" "}
                {inQueueCount !== -1 && (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />

                    {" "+(inQueueCount + 1) + " elements in process queue"}
                  </>
                )}
              </h6>
            </div>
          </>
        </div>

        <Modal
          backdrop="static"
          size="lg"
          show={!context.isLoggedIn}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <SignIn />
        </Modal>
      </Form>
    </>
  );
};

export default DragDrop;
