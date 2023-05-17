import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { data } from './data.js';
//import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const categoryList = [
  { value: 'gazete', label: 'gazete' },
  { value: 'News', label: 'News' },

];

function App2() {
  const [contacts, setContacts] = useState(data);
  const [search, setSearch] = useState('');


  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex= currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = contacts.slice(firstIndex, lastIndex); //0 ile 100 arasındaki verileri alır
  const npage = Math.ceil(contacts.length / recordsPerPage);
  const numbers = [...Array(npage +1).keys()].slice(1);
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

  return (
    <div>
         <Container>
        <h1 className='text-center mt-4'>Şehir hafizasi</h1>
        <Form>
          <InputGroup className='my-3'>

            {/* onChange for search */}
            <Form.Control
               onChange={(e) => setSearch(e.target.value)}
              placeholder='Search contacts'
            />
          </InputGroup>
        </Form>
        <hr />
        </Container>
        <Container>
        <Row>
        <Col lg={9}>
          {data
              .filter((item) => {
                return search.toLowerCase() === ''
                  ? item
                  : item.first_name.toLowerCase().includes(search);
              })
              .map((d, i) => (
                <div class="card dark" key={i}>
                 <img src="https://images.unsplash.com/photo-1684178801256-1e8ad802fa57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=418&q=80" class="card-img-top" alt="..."/> 
           <div class="card-body" >
             
               <div class="text-section">
                   <h5 class="card-title fw-bold">{d.first_name}</h5>
                   <p class="card-text">{d.last_name}</p>
               </div>
               <div class="cta-section">
                   
                   <a href="#" class="btn btn-light">Read more</a>
                   </div>
                  </div>
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
            <ul className='pagination'>
              <li className='page-item'>
                <a className='page-link' href='#' onClick={()=>prePage()}>Prev</a>
              </li>
              {
                numbers.map((n, i) => (
                  <li key={i} className={`page-item ${currentPage === n  ?  'active'  :  ' '} `} >
                     <a className='page-link' href='#' onClick={()=>changeCPage(n)}>{n}</a>
                  </li>
                ))
              }
                 <li className='page-item'>
                <a className='page-link' href='#' onClick={()=>nextPage()}>Next</a>
              </li>
              </ul>
          </nav>
        </div>  
       </Col>
        <Col lg={3}>
      <h4>
        kategoriler

      </h4>

      <div className="title">aşağıdakı listeden kategory seçebilirsiniz</div>
       {categoryList.map((x, i) => (
        <label key={i}>
          <input
            type="checkbox"
            name="lang"
            value={x.value}
            //onChange={handleChange}
          />{' '}
          {x.label}
        </label>
      ))} 

      {/* <div>seçilen kategoriler: {lang.length ? lang.join(', ') : null}</div> */}
    </Col>
    </Row>
      </Container>
    </div>
  );
  function  prePage(){
    if(currentPage !== firstIndex){
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id){
   setCurrentPage(id);
  }
  function nextPage(){
    if(currentPage !== lastIndex){
      setCurrentPage(currentPage  +1);
    }
  }
}

export default App2;
