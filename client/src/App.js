import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthMiddleware from "./components/AuthMiddleware";
import RegisterUser from "./components/Login/RegisterUser";
import UsersList from "./components/Users/UsersList";
import Login from "./components/Login/Login";
import SignOut from "./components/Login/SignOut";
import SendEmailRecovery from "./components/Login/SendEmailRecovery";
import ResetPass from "./components/Login/ResetPass";
import AllAccounts from "./components/Accounts/AllAccounts";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/reset" element={<SendEmailRecovery />} />
        <Route path="/" element={<Login />} />
        <Route path="/accounts" element={<AuthMiddleware><AllAccounts /></AuthMiddleware>} />
        <Route path="/users" element={<AuthMiddleware><UsersList /></AuthMiddleware>} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/reset/:token" element={<ResetPass />} />
      </Routes>
    </Router>
  );
};

export default App;
