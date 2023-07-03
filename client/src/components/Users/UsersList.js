import React, { useState, useEffect } from "react";

import axios from "axios";
import moment from "moment";
import SideMenu from "../SideMenu";
import ChangeUserRole from "./ChangeUserRole";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const apiUrl = process.env.PASSWORD_RESET_URL || `http://localhost:8080/user`
      const response = await axios.get(apiUrl, config);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="w-full sm:w-1/5">
          <SideMenu />
        </div>
        <div className="w-full sm:w-4/5 p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Users:</h2>
          </div>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Updated At</th>
                <th className="py-2 px-4 border-b">User</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.ID}>
                  <td className="py-2 px-4 border-b">{user.ID}</td>
                  <td className="py-2 px-4 border-b">{user.Email}</td>
                  <td className="py-2 px-4 border-b">{user.Username}</td>
                  <td className="py-2 px-4 border-b">{user.Role}</td>
                  <td className="py-2 px-4 border-b">
                    {moment(user.CreatedAt).format("lll")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {moment(user.UpdatedAt).format("lll")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <ChangeUserRole user={user} fetchUsers={fetchUsers} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UsersList;
