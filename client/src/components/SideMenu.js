import React from "react";
import { Link } from "react-router-dom";
import BreadcrumbsMenu from "./BreadcrumbsMenu";

const SideMenu = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col bg-gray-800 text-white w-64">
        <div className="p-4">
          <h1 className="text-2xl font-bold">
        <BreadcrumbsMenu/>
      </h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 py-4 px-6">
            <li className="border-l-4 border-transparent hover:border-blue-500">
              <Link to="/accounts" className="block p-2">
                Accounts
          </Link>
            </li>
            <li className="border-l-4 border-transparent hover:border-blue-500">
              <Link to="/users" className="block p-2">
                Users
          </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <ul className="space-y-2 py-4 px-6 flex items-center">
            <li className="border-l-4 border-transparent hover:border-blue-500 flex items-center">
              <Link to="/signout" className="block p-2 flex items-center">
                Sign out{" "}
                <svg
                  className="h-6 w-6 text-white ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>


  );
};

export default SideMenu;
