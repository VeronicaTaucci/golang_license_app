import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import jwt_decode from "jwt-decode";

const AccountDropdown = ({
  account,
  handleAccInfo,
  handleEditAccount,
  handleEmailModal,
  handleDeleteAccount,
}) => {
  const hasEditorPrivileges = () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    if (token) return decodedToken.role !== "Viewer";
    else return false;
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="m-2 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        Options
        <ChevronDownIcon className="-mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          <li
            className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
            type="button"
            onClick={() => handleEmailModal(account)}
          >
            Email Token
          </li>
        </Menu.Item>

        {hasEditorPrivileges() && (
          <Menu.Item>
            <li
              className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
              type="button"
              onClick={() => handleEditAccount(account)}
            >
              Edit
            </li>
          </Menu.Item>
        )}

        <Menu.Item>
          <li
            className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
            type="button"
            onClick={() => handleAccInfo(account)}
          >
            Info
          </li>
        </Menu.Item>

        {hasEditorPrivileges() && (
          <Menu.Item>
            <li
              className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
              type="button"
              onClick={() => handleDeleteAccount(account.account.ID)}
            >
              Delete
            </li>
          </Menu.Item>
        )}
      </Menu.Items>
    </Menu>
  );
};

export default AccountDropdown;
