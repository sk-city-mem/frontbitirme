import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import App2 from "./app2";
import SignIn from "./SignIn";
import DrogDrop from "./DrogDrop";
import { AdminAuthContextProvider } from "./AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AdminAuthContextProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App2 />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/drogdrop" element={<DrogDrop />} />
      </Routes>
    </Router>
    </AdminAuthContextProvider>
  </React.StrictMode>
);
