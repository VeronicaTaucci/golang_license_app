import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/style.css";

const SendEmailRecovery = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [displayAlert, setDisplayAlert] = useState(false);
  const [disableSendButton, setDisableSendButton] = useState(false)
  const validateEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);


  useEffect(() => {
    if (displayAlert) {
      const timeoutId = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [displayAlert, navigate]);

  const sendEmailRecovery = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please provide a valid email")
      return
    }
    try { 
      const apiUrl = process.env.PASSWORD_RESET_URL || `http://localhost:8080/user`
      setDisableSendButton(true)
      const api = `${apiUrl}/:id/password/reset`
      await axios.post(api, {email});
      setDisplayAlert(true);
    } catch (error) {
      if (error.response?.data?.error) setError(error.response?.data?.error);
      else setError("An error occurred during password reset.");
      setDisableSendButton(false)
    }
  };

  const renderAlert = () => (
    <div
      id="toast-simple"
      className="flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
      role="alert"
    >
      <div className="pl-4 text-sm font-normal">Please check your email.</div>
    </div>
  );

  const renderButton = () => (
    <div className="flex justify-end">
      <button
        disabled={disableSendButton}
        type="submit"
        className=" ml-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        Reset Password
      </button>
    </div>
  );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-80">
        <h2 className="text-2xl mb-4">Reset Password</h2>
        <form onSubmit={sendEmailRecovery} onChange={()=>setError("")}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {displayAlert ? renderAlert() : renderButton()}
          {error && <p className="mt-3 text-red-500">{error}</p>}
        </form>
        <p className="mt-3 text-sm">
          Need to log in instead?
          <a href="/" className="text-blue-500 hover:text-blue-600">
            Go to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SendEmailRecovery;
