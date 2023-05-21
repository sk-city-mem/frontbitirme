import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import App2 from './app2';
import SignIn from './SignIn'; 
import DrogDrop from './DrogDrop'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App/> */}
      <App2 />   
      {/* <SignIn />   */}
     {/* <DrogDrop/>  */}
  </React.StrictMode>
);

