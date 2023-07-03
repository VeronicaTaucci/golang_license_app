import React, { useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { checkErrors } from '../validationUtils';

const RegisterAccount = ({ closeAccountModal, fetchAccounts }) => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt_decode(token);
  const [error, setError] = useState([]);

  const [formData, setFormData] = useState({
    account: {
      description: "",
      maxUsers: "",
      maxCores: "",
      firstName: "",
      lastName: "",
      company: "",
      licenseType: "Site",
      email: "",
      createdBy: decodedToken.email,
    },
    exp: new Date(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validForm = checkErrors(formData, setError);
    if (!validForm) return;

    const newDate = new Date(formData.exp);
    const unixTimestamp = Math.floor(newDate.getTime() / 1000);
    formData.exp = unixTimestamp;
    try {
      const apiUrl =
        process.env.ACCOUNTS_API_URL || `http://localhost:8080/account`;
      await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      closeAccountModal();
      fetchAccounts();
    } catch (error) {
      if (error?.response?.data?.errors) setError(error.response.data.errors);
      else console.error("Error registering account:", error);
    }
  };

  const handleChange = (e) => {
    setError([]);
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseInt(value) : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      account: {
        ...prevFormData.account,
        [name]: parsedValue,
      },
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-4/5">
        <h2 className="text-2xl mb-4">Register Account</h2>
        <ul className=" border-red-500 text-red-700 mb-8 ">
          {error.length > 0
            ? error.map((err) => {
                return <li>{err}</li>;
              })
            : null}
        </ul>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/3 px-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-2 font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.account.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="w-1/3 px-2">
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.account.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="w-1/3 px-2">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.account.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="w-1/3 px-2">
              <div>
                <label
                  htmlFor="company"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.account.company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="w-1/3 px-2">
              <div>
                <label
                  htmlFor="maxCores"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Cores
                </label>
                <input
                  type="number"
                  id="maxCores"
                  name="maxCores"
                  value={formData.account.maxCores}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="w-1/3 px-2">
              <div>
                <label
                  htmlFor="maxUsers"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Max Users
                </label>
                <input
                  type="number"
                  id="maxUsers"
                  name="maxUsers"
                  value={formData.account.maxUsers}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="w-1/3 px-2">
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.account.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="w-1/3 px-2">
              <label
                htmlFor="exp"
                className="block mb-2 font-medium text-gray-700"
              >
                Expiration Date
              </label>

              <DatePicker
                minDate={new Date()}
                autoComplete="off"
                id="exp"
                name="exp"
                selected={formData.exp}
                onChange={(date) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    exp: date,
                  }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="w-1/3 px-2">
              <label
                htmlFor="license-type"
                className="mt-4 font-medium text-gray-700 mr-2"
              >
                License's type
              </label>
              <input
                id="default-checkbox"
                type="radio"
                name="licenseType"
                value="Multi-user"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={handleChange}
              />
              <label
                htmlFor="default-checkbox"
                className="mr-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Multi-User
              </label>
              <input
                id="site-license"
                defaultChecked={true}
                type="radio"
                name="licenseType"
                value="Site"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={handleChange}
              />
              <label
                htmlFor="site-license"
                className="mr-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Site
              </label>
              <input
                id="other-license"
                type="radio"
                name="licenseType"
                value="other"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={handleChange}
              />
              <label
                htmlFor="other-license"
                className="mr-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Other
              </label>
            </div>
          </div>
          <div className="m-6 flex justify-end">
            <button
              type="submit"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Register Account
            </button>
            <button
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              onClick={closeAccountModal}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterAccount;
