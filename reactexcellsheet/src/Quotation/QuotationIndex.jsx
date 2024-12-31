import React, { useState, useRef } from "react";
import QutationUploadfile from "../Quotation/QuotationUploadfile";
import QutationTable from "./QuotationTable";
import { useDispatch } from "react-redux";
import { fetchQutationsByType } from "../store/Qutationfile/QutationSlice";

function QuotationIndex() {
  const [isOpen, setIsOpen] = useState(false);
  const [QutationType, setQutationType] = useState("D-martqutation"); // Default value should match backend
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const articleChange = (e) => {
    setQutationType(e.target.value);
    dispatch(fetchQutationsByType({ QutationType: e.target.value }));
  };

  const handleEnableEdit = () => {
    if (tableRef.current) {
      tableRef.current.handleEnableEdit();
    }
  };

  const handleExportData = () => {
    if (tableRef.current) {
      tableRef.current.handleExportData();
    }
  };

  const handleExportDelete = () => {
    if (tableRef.current) {
      tableRef.current.handleDeleteAllData();
    }
  };
  return (
    <>
      <div className="flex justify-around items-center">
        <button
          type="button"
          onClick={openModal}
          className="px-5 py-2 mt-9 rounded-full text-white text-sm font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
        >
          Upload Central Qutation
        </button>
        <div className="flex gap-3 py-2 items-center">
          <button
            onClick={handleEnableEdit}
            className="px-5 py-2 bg-yellow-500 text-white rounded-full text-sm font-medium hover:bg-yellow-600 focus:outline-none focus:ring-4   mt-9 focus:ring-yellow-300 transition"
          >
            Enable Edit
          </button>
          <button
            onClick={handleExportData}
            className="px-5 py-2 flex items-center bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-4  mt-9 focus:ring-green-300 transition"
          >
            Export
          </button>
          <button
            onClick={handleExportDelete}
            className="px-5 py-2 flex items-center bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-4 mt-9 focus:ring-red-300 transition"
          >
            <span>Delete</span>
          </button>
        </div>
        {/* <select
          id="QutationType"
          value={QutationType}
          onChange={articleChange}
          className="bg-gray-50 mt-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="D-martqutation">D-mart</option>
          <option value="SPAR-qutation">Spaar</option>
          <option value="OptionC">Option C</option>
          <option value="OptionD">Option D</option>
        </select> */}
      </div>

      <QutationUploadfile isOpen={isOpen} closeModal={closeModal} />
      <QutationTable ref={tableRef} QutationType={QutationType} />
    </>
  );
}

export default QuotationIndex;
