import React from "react";
import DownloadLicenseToken from "./DownloadLicenseToken";

const InfoModal = ({ account, closeModal }) => {
  const { firstName, lastName, company, email, licenseType, description, maxCores, maxUsers, createdBy } =
  account.account;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-4/5">
        <h2 className="text-xl font-bold mb-4">Account Info</h2>
        <ul className="flex flex-wrap w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-r border-gray-200 rounded-t-lg dark:border-gray-600">
            <strong>First Name:</strong> {firstName}
          </li>
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <strong>Last Name:</strong> {lastName}
          </li>
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-r border-gray-200 dark:border-gray-600">
            <strong>Email:</strong> {email}
          </li>
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <strong>Company:</strong> {company}
          </li>
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-r border-gray-200 dark:border-gray-600">
            <strong>Cores:</strong> {maxCores}
          </li>
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-r border-gray-200 dark:border-gray-600">
            <strong>Max Users:</strong> {maxUsers}
          </li>
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <strong>Description:</strong> {description}
          </li>
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <strong>License Type:</strong> {licenseType}
          </li>
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <strong>Created By:</strong> {createdBy}
          </li>
          <li className="flex-auto w-1/2 px-4 py-2 border-b border-r border-gray-200 dark:border-gray-600">
            <strong>Expiration Date:</strong> {(new Date(account.exp * 1000)).toLocaleString()}
          </li>
        </ul>

        <div className="flex justify-end">
          <DownloadLicenseToken account={account} />
          <button
            className=" bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg text-sm px-5 py-2.5 m-2 mt-4"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
