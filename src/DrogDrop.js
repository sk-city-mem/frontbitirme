import { useState, useRef } from "react";
import "./styleDrog.css";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { FilePdfFill } from 'react-bootstrap-icons';
const DragDrop = () => {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files)
  };
  
  // send files to the server // learn from my other video
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("Files", files);
    console.log(formData.getAll())
    // fetch(
    //   "link", {
    //     method: "POST",
    //     body: formData
    //   }  
    // )
  };

  if (files) return (
    <div className="uploads">
         <ol> 
            {Array.from(files).map((file, idx) => <li key={idx}><FilePdfFill color="red" size={40}></FilePdfFill>{file.name}</li> )}
         </ol> 
        <div className="actions">
            
            <Button onClick={() => setFiles(null)} variant="danger" type="submit">İptal</Button>
            <Button onClick={handleUpload} variant="success" type="submit">Yükle</Button>
            
        </div>
    </div>
  )

  return (
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
          <Button onClick={() => inputRef.current.click()} variant="primary" type="submit">Dosyaları Seç</Button>
          {/* <button onClick={() => inputRef.current.click()}>Select Files</button> */}
        </div>
    </>
  );
};

export default DragDrop;