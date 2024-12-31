import React, { useState } from "react";
import { ArticleMasterFileUpload ,getArticleTypes} from "../store/Articlemaster/ArticlemasterSlice";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";

function ArticleUploadFile({ isOpen, closeModal }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [articleType, setArticleType] = useState("D-mart");
  const [uploadInterval, setUploadInterval] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    simulateUpload(selectedFile);
  };

  const simulateUpload = (file) => {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
      } else {
        progress += 10;
        setUploadProgress(progress);
      }
    }, 200);
    setUploadInterval(interval);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    simulateUpload(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleArticleTypeChange = (e) => {
    setArticleType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !articleType) {
      Swal.fire({
        title: "Warning",
        text: "Please select a file and article type.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    setIsUploading(true);
    dispatch(ArticleMasterFileUpload({ file, articleType }))
      .unwrap()
      .then((result) => {
        Swal.fire({
          title: "Success",
          text: result.message || "File uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          closeModal();
          resetForm();
          dispatch(getArticleTypes({articleType}));
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error || "An error occurred while uploading the file.",
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleCancelUpload = () => {
    if (uploadInterval) {
      clearInterval(uploadInterval);
      setUploadInterval(null);
    }
    resetForm();
  };

  const resetForm = () => {
    setFile(null);
    setUploadProgress(0);
    setArticleType("");
    setIsUploading(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
            <div className="flex items-center pb-3 border-b border-gray-200">
              <div className="flex-1">
                <h3 className="text-gray-800 text-xl font-bold">Upload File</h3>
                <p className="text-gray-600 text-xs mt-1">
                  Upload file to this project
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 ml-2 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500"
                viewBox="0 0 320.591 320.591"
                onClick={closeModal}
              >
                <path
                  d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                  data-original="#000000"
                ></path>
                <path
                  d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                  data-original="#000000"
                ></path>
              </svg>
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <label
                htmlFor="articleType"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Select an option
              </label>
              <select
                id="articleType"
                value={articleType}
                onChange={handleArticleTypeChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Choose an Article</option>
                <option value="D-mart">D-mart</option>
                <option value="Spaar">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>

              <div
                className="rounded-lg border-2 border-gray-200 border-dashed mt-6"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="p-4 min-h-[180px] flex flex-col items-center justify-center text-center cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 mb-4 fill-gray-600 inline-block"
                    viewBox="0 0 32 32"
                  >
                    <path
                      d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                      data-original="#000000"
                    />
                    <path
                      d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                      data-original="#000000"
                    />
                  </svg>

                  <h4 className="text-sm text-gray-600">
                    Drag & Drop or{" "}
                    <label
                      htmlFor="chooseFile"
                      className="text-blue-600 cursor-pointer"
                    >
                      Choose file
                    </label>{" "}
                    to upload
                  </h4>
                  <input
                    id="chooseFile"
                    className="hidden w-full h-full"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {file && (
                <div className="flex flex-col bg-gray-50 p-4 rounded-lg mt-4">
                  <div className="flex">
                    <p className="text-xs text-gray-600 flex-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="w-5 mr-2 fill-current inline-block"
                      >
                        <path
                          d="m433.798 106.268-96.423-91.222C327.119 5.343 313.695 0 299.577 0H116C85.673 0 61 24.673 61 55v402c0 30.327 24.673 55 55 55h280c30.327 0 55-24.673 55-55V146.222c0-15.049-6.27-29.612-17.202-39.954zM404.661 120H330c-2.757 0-5-2.243-5-5V44.636zM396 482H116c-13.785 0-25-11.215-25-25V55c0-13.785 11.215-25 25-25h179v85c0 19.299 15.701 35 35 35h91v307c0 13.785-11.215 25-25 25z"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M181 111h90c8.284 0 15-6.716 15-15s-6.716-15-15-15h-90c-8.284 0-15 6.716-15 15s6.716 15 15 15zm0 60h150c8.284 0 15-6.716 15-15s-6.716-15-15-15H181c-8.284 0-15 6.716-15 15s6.716 15 15 15zm150 60H181c-8.284 0-15 6.716-15 15s6.716 15 15 15h150c8.284 0 15-6.716 15-15s-6.716-15-15-15zm0 60H181c-8.284 0-15 6.716-15 15s6.716 15 15 15h150c8.284 0 15-6.716 15-15s-6.716-15-15-15zm0 60H181c-8.284 0-15 6.716-15 15s6.716 15 15 15h150c8.284 0 15-6.716 15-15s-6.716-15-15-15z"
                          data-original="#000000"
                        ></path>
                      </svg>
                      {file.name}
                    </p>
                    <span className="text-xs text-gray-600">
                      {file && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 ml-2 cursor-pointer shrink-0  fill-gray-400 hover:fill-red-500"
                          viewBox="0 0 320.591 320.591"
                          onClick={handleCancelUpload}
                        >
                          <path
                            d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                            data-original="#000000"
                          ></path>
                          <path
                            d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                            data-original="#000000"
                          ></path>
                        </svg>
                      )}
                      {Math.round(file.size / 1024)} KB
                    </span>
                  </div>

                  <div className="relative pt-2">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                      <div
                        style={{ width: `${uploadProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>

                    <div className="text-right text-xs text-gray-600 mt-1">
                      {uploadProgress}%
                    </div>
                  </div>
                </div>
              )}

              <div className="text-right space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-medium"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className={`px-4 py-2 text-white rounded-lg transition duration-200 ${
                    isUploading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ArticleUploadFile;
