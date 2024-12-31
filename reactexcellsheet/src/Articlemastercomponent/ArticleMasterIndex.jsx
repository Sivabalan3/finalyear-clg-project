import React, { useState, useRef, useEffect } from "react";
import ArticleUploadFile from "./ArticleUploadFile";
import ArticlemasterDynamicTable from "./ArticlemasterDynamicTable";
import { useDispatch } from "react-redux";
import { getArticleTypes } from "../store/Articlemaster/ArticlemasterSlice";

function ArticleMasterIndex() {
  const [isOpen, setIsOpen] = useState(false);
  const [Articletype, setArticleType] = useState("D-mart");
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  useEffect(() => {
    dispatch(getArticleTypes());
  }, [dispatch]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const articleChange = (e) => {
    setArticleType(e.target.value);
    dispatch(getArticleTypes({ articleType: e.target.value }));
  };

  const handleEnableEdit = () => {
    tableRef.current.handleEnableEdit();
  };

  const handleExportData = () => {
    tableRef.current.handleExportData();
  };

  const handleDeleteData = () => {
    tableRef.current.handleDeleteData();
  };

  return (
    <>
      <div className="flex justify-around">
        <button
          type="button"
          onClick={openModal}
          className="px-4 mt-10 mb-10 py-2 rounded-full text-white text-sm border-none outline-none tracking-wide bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
        >
          Upload Article
        </button>
        <div className="flex py-2">
          <button
            onClick={handleEnableEdit}
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 rounded-full focus:ring-4 focus:ring-yellow-300 font-medium  text-sm px-5 h-10 mt-8 me-2 mb-2 dark:focus:ring-yellow-900"
          >
            Enable Edit
          </button>
          <button
            onClick={handleExportData}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 h-10 mt-8 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Export
          </button>
          <button
            onClick={handleDeleteData}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 h-10 mt-8 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Delete
          </button>
        </div>
        <select
          id="articleType"
          value={Articletype}
          defaultValue={Articletype}
          onChange={articleChange}
          className="bg-gray-50 mt-10 h-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="">Choose an Article</option>
          <option value="D-mart">D-mart</option>
          <option value="Spaar">Spaar</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>
      </div>

      <ArticleUploadFile isOpen={isOpen} closeModal={closeModal} />
      <ArticlemasterDynamicTable ref={tableRef} Articletype={Articletype} />
    </>
  );
}

export default ArticleMasterIndex;
