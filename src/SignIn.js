import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import axios from 'axios';
import { useState } from "react";
import swal from 'sweetalert';


 
export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function loginUser(credentials) {
    return fetch('sign in api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      email,
      password
    });
    if ('accessToken' in response) {
      swal("Success", response.message, "success", {
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        localStorage.setItem('accessToken', response['accessToken']);
        localStorage.setItem('user', JSON.stringify(response['user']));
        window.location.href = "/dropdrop";
      });
    }
    else {
      swal("Failed", response.message, "error");
    }
  }
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
                    <Form  onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>
                          Email
                        </Form.Label>
                        <Form.Control type="text" placeholder="Enter email"  required onChange={(e) => setEmail(e.target.value)} />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Şifre</Form.Label>
                        <Form.Control type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
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