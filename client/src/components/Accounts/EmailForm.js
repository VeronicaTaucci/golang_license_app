import React, { useState, useRef } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const EmailForm = ({ account, closeModal }) => {
  const { company, email, licenseType, description, maxCores, maxUsers, token } =
    account.account;
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const validateEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  const emailMessage = `
  Here are the details associated with the token:
     Company: ${company}
     Email: ${email}
     Expiration: ${new Date(account.exp * 1000).toLocaleString()}
     License Type: ${licenseType}
     Description: ${description}
     Maximum Cores: ${maxCores}
     Maximum Users: ${maxUsers}
   `;
  const [primaryRecipient, setPrimaryRecipient] = useState(email);
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [message, setMessage] = useState(emailMessage);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState(false);
  const [useAccountTokenCheckbox, setUseAccountTokenCheckbox] = useState(false);
  const inputRef = useRef();

  const handleClear = () => {
    setFile(null);
    setUseAccountTokenCheckbox(false);
  };

  const onDrop = (acceptedFiles) => {
    setUseAccountTokenCheckbox(false);
    setFile(acceptedFiles[0]);
  };
  const { isDragActive } = useDropzone({ onDrop });

  const handleUseAccountToken = (isChecked) => {
    setUseAccountTokenCheckbox(isChecked);
    if (isChecked) {
      const tokenContent = token;
      const fileName = "token.txt";
      const file = new File([tokenContent], fileName, { type: "text/plain" });
      setFile(file);
    } else {
      setFile(null);
    }
  };
  const checkErrors = () => {
    const validEmail = validateEmail(primaryRecipient);
    if (!validEmail) {
      setError(["Please enter a valid email"]);
      return false;
    }
    if (!validateEmail(secondaryEmail) && secondaryEmail !== "") {
      setError(["Please enter a valid email"]);
      return false;
    }
    if (!file) {
      setError("Please attach a file.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validForm = checkErrors();
    if(!validForm)return;
      try {
        setIsSendingEmail(true);

        const apiUrl = process.env.SEND_EMAIL_URL || `http://localhost:8080/account/email/send`;
        const formData = new FormData();
        formData.append("primaryRecipient", primaryRecipient);
        formData.append("secondaryRecipient", secondaryEmail);
        formData.append("message", message);
        formData.append("file", file);

        const response = await axios.post(
          apiUrl,
          formData
        );

        const data = response.data;

        if (!data.error) {
          setEmailConfirmation(true);
          setTimeout(() => {
            closeModal();
          }, 3000);
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.log(error);
      }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-4/5">
        <h2 className="text-2xl font-bold mb-2">Send Email</h2>

        {error ? (
          <span
            className="bg-red-100 border-red-500 text-red-700 p-2"
            role="alert"
          >
            {error}
          </span>
        ) : (
          <span className="p-2" role="alert"></span>
        )}
        <form
          onSubmit={handleSubmit}
          onChange={() => setError("")}
          className="mt-2"
        >
          <div className="mb-4 flex">
            <div className="w-1/2 mr-2">
              <label
                htmlFor="primaryRecipient"
                className="block mb-2 font-medium text-gray-700"
              >
                Receiver's Email:
              </label>
              <input
                type="email"
                id="primaryRecipient"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                value={primaryRecipient}
                onChange={(e) => setPrimaryRecipient(e.target.value)}
                required
              />
            </div>
            <div className="w-1/2 ml-2">
              <label
                htmlFor="secondaryRecipient"
                className="block mb-2 font-medium text-gray-700"
              >
                Secondary Email (optional):
              </label>
              <input
                type="email"
                id="secondaryRecipient"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                onChange={(e) => setSecondaryEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block mb-2 font-medium text-gray-700"
            >
              Message:
            </label>
            <textarea
              id="message"
              rows="10"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div className="flex items-center mt-4">
            <input
              id="attach-token-checkbox"
              type="checkbox"
              checked={useAccountTokenCheckbox}
              onChange={(e) => handleUseAccountToken(e.target.checked)}
            />
            <label
              htmlFor="attach-token-checkbox"
              className="ml-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Attach account's token
            </label>
          </div>
          <div
            className={`dropzone ${isDragActive ? "active" : ""}`}
            onClick={() => inputRef.current.click()}
            onDrop={(e) => setFile(e.dataTransfer.files)}
            onDragOver={(e) => e.preventDefault()}
          >
            <label
              className={`dropzone  ${
                isDragActive ? "active" : ""
              } flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
            >
              <div className="flex flex-col items-center justify-center m-2">
                {file ? (
                  <div>
                    <svg
                      aria-hidden="true"
                      className="h-10 mb-3 text-gray-400 w-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="M5.5 3.5h10a2 2 0 012 2v10a2 2 0 01-2 2h-10a2 2 0 01-2-2v-10a2 2 0 012-2z" />
                        <path d="M7.5 10.5l2 2 4-4" />
                      </g>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {file[0]?.name || file.name}{" "}
                      <span className="font-semibold">uploaded</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <svg
                      aria-hidden="true"
                      className="h-10 mb-3 text-gray-400 w-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  </div>
                )}
              </div>
            </label>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="m-6 flex justify-end">
            {emailConfirmation ? (
              <div
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                role="alert"
              >
                <span className="font-bold">Success</span> Email was
                successfully sent.
              </div>
            ) : (
              <>
                {file != null ? (
                  <button
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={handleClear}
                  >
                    clear
                  </button>
                ) : null}
                <button
                  disabled={isSendingEmail}
                  type="submit"
                  className={`text-white ${
                    isSendingEmail
                      ? "bg-gray-500 hover:bg-gray-500"
                      : "bg-gray-800 hover:bg-gray-900"
                  }  focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
                >
                  Send Email
                </button>
              </>
            )}
            <button
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;
