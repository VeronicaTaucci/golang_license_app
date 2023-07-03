import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import AccTooltip from "../Accounts/AccountTooltip";
import jwt_decode from 'jwt-decode';

export default function ChangeUserRole({ user, fetchUsers }) {
  const [userRole, setUserRole] = useState();
  const token = localStorage.getItem('token');
  const decodedToken = jwt_decode(token);

  useEffect(() => {
    setUserRole(decodedToken.role);
  }, []);

  const changeRole = async (e) => {
    const newRole = {
      id: user.ID,
      role: e.target.innerText,
    };
    try {
      const apiUrl = process.env.PASSWORD_RESET_URL || `http://localhost:8080/user`
      await axios.put(
        `${apiUrl}/${newRole.id}/role`,
        newRole,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        {userRole !== "Admin" ? (
          <Menu.Button
            disabled
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <AccTooltip message={"change the role"} />

            {user.Role}
          </Menu.Button>
        ) : user.ID === decodedToken.id ? (
          <Menu.Button disabled={true} className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {user.Role}
        </Menu.Button>
        ) : (
          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {user.Role}
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        )}
      </div>
      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          <button
            className="text-gray-900 block px-4 py-2 text-sm w-full"
            onClick={(e) => changeRole(e)}
          >
            Editor
          </button>
        </Menu.Item>
        <Menu.Item>
          <button
            className="text-gray-900 block px-4 py-2 text-sm w-full"
            onClick={(e) => changeRole(e)}
          >
            Viewer
          </button>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
