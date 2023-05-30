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
} from "react-bootstrap";
import { FilePdfFill } from "react-bootstrap-icons";
import axios from "axios";
import SignIn from "./SignIn";
import { useAuthContext } from "./AuthProvider";

const DragDrop = () => {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();
  const [smShow, setSmShow] = useState(false);
  const context = useAuthContext()

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const formData = new FormData();


  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

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
  const sendUploadRequest = () => {
    formData.append("file", files[0]);
    formData.append("name", "akşam");
    axios.post("http://localhost:3000/pdf-news-doc-orm/upload/",formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${context.token}` 
      },
    });
  }
  
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/SignIn";
  };

  const token = localStorage.getItem("accessToken");
  // if(!token) {
  //   return <SignIn />
  // }
  if (files)
    return (
      <div className="uploads">
        <ol>
          {Array.from(files).map((file, idx) => (
            <li key={idx}>
              <FilePdfFill color="red" size={40}></FilePdfFill>
              {file.name}
            </li>
          ))}
        </ol>
        <div className="actions">
          <Button onClick={() => setFiles(null)} variant="danger" type="submit">
            İptal
          </Button>
          <Button onClick={handleUpload} variant="success" type="submit">
            Yükle
          </Button>
          <Button onClick={sendUploadRequest} variant="success" type="submit">
            Send
          </Button>
        </div>
        <div className="actions">
          <Button onClick={handleLogout} variant="danger" type="submit">
            Çıkış yap
          </Button>
        </div>
      </div>
    );

  return (
    <>
      <div className="dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
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
          type="submit"
        >
          Dosyaları Seç
        </Button>
        <Button onClick={handleLogout} variant="danger" type="submit">
          Çıkış yap
        </Button>
        <Button onClick={sendUploadRequest}>
          Send
        </Button>
        {/* <button onClick={() => inputRef.current.click()}>Select Files</button> */}
      </div>
      <Modal
        backdrop="static"
        size="lg"
        show={!context.isLoggedIn}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <SignIn/>
      </Modal>
    </>
  );
};

export default DragDrop;
