import React, { useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { checkErrors } from '../validationUtils';

const EditModal = ({ account, closeModal, fetchAccounts }) => {
  const [editedAccount, setEditedAccount] = useState(account);
  const [error, setError] = useState([])
  const {
    firstName,
    lastName,
    company,
    maxCores,
    maxUsers,
    description,
    email,
    licenseType,
    ID,
  } = editedAccount.account;

  const handleChange = (e) => {
    setError([])
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseInt(value) : value;

    setEditedAccount((prevFormData) => ({
      ...prevFormData,
      account: {
        ...prevFormData.account,
        [name]: parsedValue,
      },
    }));
  };

  const handleDateChange = (dateString) => {
    const date = new Date(dateString);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    setEditedAccount((prevFormData) => ({
      ...prevFormData,
      exp: unixTimestamp,
    }));
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validForm = checkErrors(editedAccount, setError);
    if (!validForm) return;
    try {

      const apiUrl = process.env.ACCOUNTS_API_URL || `http://localhost:8080/account`;
      await axios.put(`${apiUrl}/${ID}`, editedAccount, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    closeModal()
    } catch (error) {
      if(error?.response?.data?.errors)setError(error.response.data.errors)
      console.log("Error updating account:", error);
    }

    fetchAccounts()
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-4/5">
        <h2 className="text-2xl font-bold mb-4">{firstName}</h2>
        
        <ul className=" border-red-500 text-red-700">{error.length > 0 ?
         error.map((err,index) => {
          return <li key={index}>{err}</li>
        }): null}</ul>

        <form onSubmit={handleSubmit} className="flex flex-wrap">
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
                  value={firstName}
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
                  value={lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2  focus:outline-none focus:border-blue-500"
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
                  value={email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2  focus:outline-none focus:border-blue-500"
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
                  value={company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2  focus:outline-none focus:border-blue-500"
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
                  min={1}
                  max={32767}
                  value={maxCores}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2  focus:outline-none focus:border-blue-500"
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
                  min={1}
                  max={32767}
                  value={maxUsers}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2  focus:outline-none focus:border-blue-500"
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
                placeholder="description"
                  type="text"
                  id="description"
                  name="description"
                  value={description}
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
                selected={new Date(editedAccount.exp * 1000)}
                onChange={handleDateChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div onChange={handleChange} className="w-1/3 px-2">
              <label
                htmlFor="license-type"
                className="mt-4 font-medium text-gray-700 mr-2"
              >
                License's type
              </label>
              <input
                id="default-checkbox"
                type="radio"
                defaultChecked={licenseType === "Multi-user"}
                name="licenseType"
                value="Multi-user"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-checkbox"
                className="mr-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Multi-User
              </label>
              <input
                id="site-license"
                type="radio"
                name="licenseType"
                defaultChecked={licenseType === "Site"}
                value="Site"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                defaultChecked={licenseType === "other"}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="other-license"
                className="mr-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Other
              </label>
            </div>
          </div>
          <div className="flex justify-end w-full">
            <button
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              type="submit"
            >
              Save
            </button>
            <button
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
