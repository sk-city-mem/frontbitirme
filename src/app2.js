import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import { data } from "./data.js";
import { data2 } from "./data2.js";
import axios from "axios";
import { Button, Stack } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import swal from "sweetalert";

function App2() {
  const [data, setData] = useState();
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

  const navigateData = (currentSelectedPage) => {
    console.log(date1);
    navigate({
      pathname: "",
      search: createSearchParams({
        ...(currentPage && {
          pageNo:
            currentSelectedPage === 0 || currentSelectedPage
              ? currentSelectedPage
              : currentPage,
        }),
        ...(searchContents && { content: searchContents }),
        ...(date1 && { from: new Date(date1).toISOString() }),
        ...(date2 && { to: new Date(date2).toISOString() }),
        ...(searchName && { name: searchName }),
      }).toString(),
    });
  };

  /*
  useEffect(()=>{
    navigateData()
  },[currentPage])
  */
  useEffect(() => {
    console.log("content", searchParams.get("content"));
    if (
      searchParams.get("content") ||
      searchParams.get("from") ||
      searchParams.get("to") ||
      searchParams.get("name")
    ){
      getData();
    }else{
      swal("Uyarı","Arama için formda en az 1 alanı doldurunuz", "warning");
    }
      
  }, [searchParams]);

  const getData = async () => {
    console.log("HERE2");
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

  const numbers = [...Array(25 + 1).keys()].slice(1);
  console.log(currentPage);

  return (
    <div>
      <Stack direction="horizontal" gap={3}>
        <div className="p-2">
          <img
            height="100px"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sakarya_University_logo.svg/1200px-Sakarya_University_logo.svg.png"
          ></img>
        </div>
        <h1 className="text-center mt-4">Sakarya Yerel Gazeteler</h1>
      </Stack>
      <hr />
      <Container>
        <Col lg={12}>
          <Form
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                navigateData();
              }
            }}
          >
            <Row>
            <Col lg={3}>
                <Form.Group>
                  {/* onChange for search */}
                  <Form.Label>İçerik</Form.Label>
                  <Form.Control
                    onChange={(e) => setSearchContents(e.target.value)}
                    placeholder="İçerik Ara"
                    className="nn"
                  />
                </Form.Group>
              </Col>

              <Col lg={3}>
                <Form.Group>
                  {/* onChange for search */}
                  <Form.Label>Gazete İsmi</Form.Label>
                  <Form.Control
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Gazete İsmi Ara"
                    className="nn"
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group>
                  {/* onChange for search */}
                  <Form.Label>Başlangıç Tarih</Form.Label>
                  <Form.Control
                    type="date"
                    name="datepic1"
                    placeholder="DateRange"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                    className="nn"
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group>
                  <Form.Label>Bitiş Tarihi</Form.Label>
                  <Form.Control
                    type="date"
                    name="datepic2"
                    placeholder="DateRange"
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                    className="nn"
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <InputGroup >
                  {/* onChange for search */}
                  <Button
                    variant="primary"
                    //type="submit"
                    className="nn"
                    onClick={() => navigateData()}
                  >
                    Ara
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>

          {data?.map((d, i) => (
            <div class="card1 dark" key={i}>
              <Row>
                <Col
                  lg={3}
                  onClick={() => window.open(d?.result?.fileURL, "_blank")}
                >
                  <img
                    src={d?.result?.fileURL + "-thumbnail.jpg"}
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
                        {d.result?.date?.toString().split("T")[0]}
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
                      currentPage === n - 1 ? "active" : " "
                    } `}
                  >
                    <a className="page-link" onClick={() => changeCPage(n - 1)}>
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
      navigateData(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
    navigateData(id);
  }
  function nextPage() {
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
      navigateData(currentPage + 1);
    }
  }
}

export default App2;
