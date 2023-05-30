import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import { data } from "./data.js";
import { data2 } from "./data2.js";
import axios from "axios";
import { Button } from "react-bootstrap";
//import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { createSearchParams, useNavigate,useSearchParams } from "react-router-dom";

function App2() {
  //const [contacts, setContacts] = useState(data);
  const [data, setData] = useState(data2);
  const [searchContents, setSearchContents] = useState("");
  const [searchName, setSearchName] = useState("");
  const [date1, setDate1] = useState();
  const [date2, setDate2] = useState();

  const navigate = useNavigate();

  const pagesize = 10;

  const firstIndex = 0;
  const lastIndex = 25;

  const [currentPage, setCurrentPage] = useState(0);

  let [searchParams, setSearchParams] = useSearchParams();
  //   useEffect(() => {
  //  getData()
  //   }, []);

  const navigateData = () =>{
    console.log(date1)
    navigate({
      pathname: "",
      search: createSearchParams({
          ...(currentPage && {pageNo: currentPage}),
          ...(searchContents && {content: searchContents}),
          ...(date1 &&  {from:new Date(date1).toISOString()}),
          ...(date2 &&  {to:new Date(date2).toISOString()}),
          ...(searchName && {name: searchName }),
      }).toString()
    });
  }

  useEffect(()=>{
    navigateData()
  },[currentPage])

  useEffect(()=>{
    getData()
  },[searchParams])


  const getData = async () => {
    console.log("HERE2")
    const url = `http://localhost:3000/pdf-news-doc/?${searchParams}`;
    try {
      const response = await axios.get(url);
      setData(response.data);
      console.log(response.data);
      if (response.status === 200) {
        console.log(response.data);
      } else {
        console.log("hata var");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //localhost:3000/pdf-news-doc/?content=İNDİRİM BEKLENTİSİ&serialname=26&from=1997-06-25T21:00:00.000Z&to=1997-06-25T22:00:00.000Z&name=akşam&pageNo=1&pageSize=1
  const numbers = [...Array(25 + 1).keys()].slice(1);
  console.log(currentPage);
  // const handleChange = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     // push selected value in list
  //     setLang((prev) => [...prev, value]);
  //   } else {
  //     // remove unchecked value from the list
  //     setLang((prev) => prev.filter((x) => x !== value));
  //   }
  // };
  // const datadata1=data2[0].result.date.toString().split('T')[0];

  return (
    <div>
      <Container>
        <h1 className="text-center mt-4">Sakarya Yerel Gazeteler</h1>
        <Form>
          <InputGroup className="my-3 me-2">
            {/* onChange for search */}
            <Form.Control
              onChange={(e) => setSearchContents(e.target.value)}
              placeholder="İçerik Ara"
              className="nn"
            />
          </InputGroup>
        </Form>
        <hr />
      </Container>
      <Container>
        <Col lg={12}>
          <Form>
            <Row>
              <Col lg={6}>
                <InputGroup className="my-5">
                  {/* onChange for search */}
                  <Form.Control
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Gazete İsmi Ara"
                    className="nn"
                  />
                </InputGroup>
              </Col>
              <Col lg={2}>
                <label>Başlangıç Tarih</label>
                <InputGroup className="my-3">
                  {/* onChange for search */}
                  <Form.Control
                    type="date"
                    name="datepic1"
                    placeholder="DateRange"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                    className="nn"
                  />
                </InputGroup>
              </Col>
              <Col lg={2}>
                <label>Bitiş Tarihi</label>
                <InputGroup className="my-3">
                  {/* onChange for search */}
                  <Form.Control
                    type="date"
                    name="datepic2"
                    placeholder="DateRange"
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                    className="nn"
                  />
                </InputGroup>
              </Col>
              <Col lg={2}>
                <InputGroup className="my-4">
                  {/* onChange for search */}
                  <Button
                    variant="primary"
                    //type="submit"
                    className="nn"
                    onClick={() =>
                      navigateData()
                    }
                  >
                    uygula
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>

          {data
            // .filter((item) => {
            //   return searchContents.toLowerCase() === ""
            //     ? item
            //     : item.first_name.toLowerCase().includes(searchContents);
            // })
            .map((d, i) => (
              <div class="card1 dark" key={i}>
                <Row>
                  <Col lg={3} onClick={()=>window.open(d?.result?.fileURL, '_blank')}>
                    <img
                      src={d?.result?.fileURL+"-thumbnail.jpg"}
                      // src="./2.jpg"
                      class="card1img"
                      alt="..."
                    />
                  </Col>
                  <Col lg={9}>
                    <div class="card-body">
                      <div class="text-header">
                        <div class="text-first">{d.result.name}</div>
                        <div class="text-tarih">
                          {d.result.date.toString().split("T")[0]}
                        </div>
                      </div>
                      <hr />
                      <div class="text-section">
                        <p class="card-text">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: d?.highlights?.content,
                            }}
                          ></div>
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}

          {/* <Table className='main-1' striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>{contacts.length}</th>
            </tr>
          </thead>
          {/* .filter((d) => {
                return search.toLowerCase() === ''
                  ? d
                  : d.first_name.toLowerCase().includes(search);
              }) 
          <tbody>
            {data
              .filter((item) => {
                return search.toLowerCase() === ''
                  ? item
                  : item.first_name.toLowerCase().includes(search);
              })
              .map((d, i) => (
                <tr key={i}>
                  <td>{d.first_name}</td>
                  <td>{d.last_name}</td>
                  <td>{d.email}</td>
                  <td>{d.phone}</td>
                </tr>
              ))}
          </tbody>
        </Table> */}

          {/* <p className='main-2'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> */}
          {/* category start */}

          {/* pagination */}
          <div>
            <nav>
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link" onClick={() => prePage()}>
                    Prev
                  </a>
                </li>
                {numbers.map((n, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === n ? "active" : " "
                    } `}
                  >
                    <a
                      className="page-link"
                      
                      onClick={() => changeCPage(n)}
                    >
                      {n}
                    </a>
                  </li>
                ))}
                <li className="page-item">
                  <a className="page-link" onClick={() => nextPage()}>
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </Col>
      </Container>
    </div>
  );

  function prePage() {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
    }
  }
}

export default App2;
