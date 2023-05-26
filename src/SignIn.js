import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import axios from 'axios';

export default function Login() {

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
    <div>
      <Container>
        {/* <Row className="vh-100 d-flex justify-content-center align-items-center"> */}
          <Col md={8} lg={6} xs={12} className="automode">
            <div className="border border-3 border-primary"></div>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-uppercase text-center ">Yönetici Paneli</h2>
                  {/* <p className=" mb-5">Please enter your login and password!</p> */}
                  <div className="mb-3">
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>
                          Email
                        </Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Şifre</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      >
                        {/* <p className="small">
                          <a className="text-primary" href="#!">
                            Forgot password?
                          </a>
                        </p> */}
                      </Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Giriş
                        </Button>
                      </div>
                    </Form>
                   
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        {/* </Row> */}
      </Container>
    </div>
  );
}