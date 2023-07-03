import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import SideMenu from "../SideMenu";
import EditModal from "./EditModal";
import InfoModal from "./InfoModal";
import EmailForm from "./EmailForm";
import AccountDropdown from "./AccountDropdown";
import RegisterAccount from "./RegisterAccount";
import AccTooltip from "./AccountTooltip";

const AllAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [editedAccount, setEditedAccount] = useState();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [infoAccount, setInfoAccount] = useState();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [emailInfo, setEmailInfo] = useState();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [userRole, setUserRole] = useState();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserRole(decodedToken.role);
    }
  }, [token]);

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line
  }, []);

  const fetchAccounts = async () => {
    try {
      const apiUrl = process.env.ACCOUNTS_API_URL || `http://localhost:8080/account`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(apiUrl, config);
      if (response.status === 200) {
        setAccounts(response.data);
      } else {
        throw new Error("Failed to fetch accounts");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditAccount = (account) => {
    setEditModalOpen(true);
    setEditedAccount(account);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEmailModal = (account) => {
    setEmailInfo(account);
    setEmailModalOpen(true);
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      const apiUrl = process.env.ACCOUNTS_API_URL || `http://localhost:8080/account`;
      await axios.delete(`${apiUrl}/${accountId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchAccounts();
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleAccInfo = (account) => {
    setInfoModalOpen(true);
    setInfoAccount(account);
  };

  const closeInfoModal = () => {
    setInfoModalOpen(false);
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
  };

  const closeAccountModal = () => {
    setAccountModalOpen(false);
  };

  const renderAccountsTable = () => (
    <table className="min-w-full">
      <thead>
        <tr key="menu">
          <th className="py-2 px-4 border-b" key="name">
            Name
          </th>
          <th className="py-2 px-4 border-b" key="email">
            Email
          </th>
          <th className="py-2 px-4 border-b" key="comapany">
            Company
          </th>
          <th className="py-2 px-4 border-b" key="status">
            Status
          </th>
          <th className="py-2 px-4 border-b" key="options"></th>
        </tr>
      </thead>
      <tbody>
        {accounts?.map((account) => (
          <tr key={account.account.ID}>
            <td className="py-2 px-4 border-b">{`${account.account.firstName} ${account.account.lastName}`}</td>
            <td className="py-2 px-4 border-b">{account.account.email}</td>
            <td className="py-2 px-4 border-b">{account.account.company}</td>
            <td className="py-2 px-4 border-b">
              {Date.now() > account.exp ? (
                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                  ACTIVE 
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                  EXPIRED
                </span>
              )}
            </td>
            <td className="py-2 px-4 border-b flex justify-center items-center">
              <AccountDropdown
                account={account}
                handleEditAccount={handleEditAccount}
                handleEmailModal={handleEmailModal}
                handleDeleteAccount={handleDeleteAccount}
                handleAccInfo={handleAccInfo}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="flex h-screen w-screen">
        <div className="w-full sm:w-1/5 h-full">
          <SideMenu/>
        </div>
        <div className="w-full sm:w-4/5 p-8 md:w-60/100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">All Accounts</h2>
            <div className="flex items-center flex-grow justify-end">
              {userRole === "Admin" || userRole === "Editor" ? (
                <Link
                  onClick={() => setAccountModalOpen(true)}
                  className="ml-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  Register Account
                </Link>
              ) : (
                <div className="flex items-center">
                  <AccTooltip message={"register user"} />
                  <button className="ml-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Register Account
                  </button>
                </div>
              )}
            </div>
          </div>
          {renderAccountsTable()}
          {editModalOpen && (
            <EditModal
              account={editedAccount}
              closeModal={closeEditModal}
              fetchAccounts={fetchAccounts}
            />
          )}
          {infoModalOpen && (
            <InfoModal
              account={infoAccount}
              closeModal={closeInfoModal}
              fetchAccounts={fetchAccounts}
            />
          )}
          {emailModalOpen && (
            <EmailForm
              account={emailInfo}
              closeModal={closeEmailModal}
              fetchAccounts={fetchAccounts}
            />
          )}
          {accountModalOpen && (
            <RegisterAccount
              closeAccountModal={closeAccountModal}
              fetchAccounts={fetchAccounts}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AllAccounts;
