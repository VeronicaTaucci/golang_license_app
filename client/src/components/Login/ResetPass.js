import React, {useState} from 'react'
import {useParams} from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ResetPass = () => {

  const [email, setEmail] = useState('');
  const [newPass, setNewPass] = useState('');  
  const [error, setError] = useState('')
  const { token } = useParams();

  const navigate = useNavigate()
  const checkParamToken = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      newPass,
      token
    };
  
    try {
      const apiUrl = process.env.PASSWORD_RESET_URL || `http://localhost:8080/user`
      await axios.put(`${apiUrl}/${token}/password/reset`, userData);
      navigate('/');
    } catch (error) {
      if (error.response) {
        console.error('Response Error:', error.response.data);
        console.error('Status Code:', error.response.status);
        console.error('Response Headers:', error.response.headers);
        setError("Invalid email or token")
      } else if (error.request) {
        setError("Server error")
        console.error('Request Error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };
  


    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-white p-8 rounded shadow-lg w-80">
            <h2 className="text-2xl mb-4">Reset Password</h2>
          {error && <p className="mt-3 text-red-500">{error}</p>}
            <form onSubmit={(e)=>checkParamToken(e)}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                  New password
                </label>
                <input
                  type="password"
                  id="password"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  placeholder="Enter your password"
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                />
              </div>
    
              <div className="flex justify-end">
                <button
                  type="submit"
                  className=" ml-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  Reset Password
                </button>
              </div>
    
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
}

export default ResetPass