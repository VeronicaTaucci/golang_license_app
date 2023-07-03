import React from "react";

const DownloadLicenseToken = ({ account }) => {
  
  const handleDownloadToken = () => {
    const fileName = "token";
    const token = account.account.token;
    const textContent = `${token}`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mt-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex items-center"
      onClick={handleDownloadToken}
    >
      Download Token
      <svg
        className="fill-current w-4 h-4 ml-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
      </svg>
    </button>
  );
};

export default DownloadLicenseToken;
