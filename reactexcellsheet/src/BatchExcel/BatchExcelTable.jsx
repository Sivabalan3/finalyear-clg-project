import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {
  batchFetchExcelData,
  DeleteBatchExcelFile,
} from "../store/batchexcelfile/batchExcelFileSlice";
import BatchUploadFile from "./BatchuploadFile";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const BatchExcelTable = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.batchExcel.batchFetchedData
  );
  const [batchdata, setBatchData] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Enable Edit");
  const BatchTableRef = useRef(null);
  const [updates, setUpdates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    dispatch(batchFetchExcelData());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const filteredData = data.map((row) => {
        const { _id, __v, ...filteredRow } = row;
        return filteredRow;
      });
      // const filteredAndSortedData = data
      // .map((row) => {
      //   const { _id, __v, ...filteredRow } = row;
      //   return filteredRow;
      // })
      // .sort((a, b) => b.UOM1_Qty - a.UOM1_Qty) //UOM1_QTY DESCENDING ORDER VALUE
      setBatchData(filteredData);
      // setBatchData(filteredAndSortedData);
    }
  }, [data]);

  useEffect(() => {
    if (batchdata.length && BatchTableRef.current) {
      const headers = Object.keys(batchdata[0]).filter(
        (header) => header !== "_id" && header !== "__v"
      );
      const columns = headers.map((header) => ({
        data: header,
        title: header,
        readOnly: !isEditable,
      }));

      BatchTableRef.current.hotInstance.updateSettings({
        data: batchdata,
        colHeaders: headers,
        columns: columns,
        colWidths: 100,
        rowHeights: 30,
        dropdownMenu: true,
        contextMenu: true,
        filters: true,
        columnSorting: true,
        cells: (row, col, prop) => {
          const cellProperties = {};
          if (batchdata[row] && batchdata[row][prop] === "INVALID") {
            cellProperties.renderer = "invalidCellRenderer";
          }
          return cellProperties;
        },
        afterChange: onCellValueChanged,
      });
    }
  }, [batchdata, isEditable]);

  useEffect(() => {
    Handsontable.renderers.registerRenderer(
      "invalidCellRenderer",
      function (instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        if (value === "INVALID") {
          td.style.backgroundColor = "red";
          td.style.color = "white";
        }
      }
    );
  }, []);

  const enableEdit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to enable editing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, enable it!",
      cancelButtonText: "No, keep it read-only",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditable(true);
        setButtonLabel("Save Edit");
        Swal.fire("Editing Enabled!", "You can now edit the table.", "success");
      }
    });
  };

  const saveEdits = async () => {
    console.log("Updates to be sent:", updates);
    try {
      await axios.put("http://localhost:5000/api/excel/update/batchfile", {
        updates,
      });
      Swal.fire("Saved!", "Changes have been saved.", "success");
      setIsEditable(false);
      setButtonLabel("Enable Edit");
      setUpdates([]);
    } catch (error) {
      console.error("Error saving changes", error);
      Swal.fire("Error!", "Failed to save changes.", "error");
    }
  };

  const exportData = () => {
    const hotInstance = BatchTableRef.current.hotInstance;
    const data = hotInstance.getData();
    const headers = hotInstance.getColHeader();

    const filteredHeaders = headers.filter(
      (header) => header !== "_id" && header !== "__v"
    );
    const filteredData = data.map((row) =>
      row.filter(
        (_, index) => headers[index] !== "_id" && headers[index] !== "__v"
      )
    );

    const dataWithHeaders = [filteredHeaders, ...filteredData];

    const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Current Batch File.xlsx");
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(DeleteBatchExcelFile()).unwrap();
          dispatch(batchFetchExcelData());
          Swal.fire("Deleted!", "The batch file has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting batch file", error);
          Swal.fire("Error!", "Failed to delete batch file.", "error");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your batch file is safe :)", "error");
      }
    });
  };

  const onCellValueChanged = (changes, source) => {
    if (source === "edit") {
      const hotInstance = BatchTableRef.current.hotInstance;
      changes.forEach(([row, col, oldValue, newValue]) => {
        if (oldValue !== newValue) {
          const id = hotInstance.getDataAtRowProp(row, "_id");
          const column = hotInstance.getColHeader(col);

          if (id && column && newValue !== undefined) {
            const update = { id, column, value: newValue };
            console.log("Recording update:", update);
            setUpdates((prevUpdates) => [...prevUpdates, update]);
            setBatchData((prevData) => {
              const newData = [...prevData];
              newData[row] = { ...newData[row], [column]: newValue };
              return newData;
            });
          }
        }
      });
    }
  };

  if (loading)
    return (
      <div className="w-full gap-x-2 flex justify-center items-center h-screen my-auto ">
        <div className="w-5 bg-[#d991c2]  h-5 rounded-full animate-bounce"></div>
        <div className="w-5  h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
        <div className="w-5 h-5  bg-[#6756cc] rounded-full animate-bounce"></div>
      </div>
    );

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-indigo-500 font-extrabold text-3xl text-center mb-6">
          Batch File Excel Upload and Display
        </h1>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3">
            <button
              onClick={openModal}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition dark:focus:ring-blue-900"
            >
              Upload A Batch File
            </button>
            <div className="absolute right-5">
              <button
                onClick={enableEdit}
                className="px-5 py-2.5 text-sm font-medium text-white bg-yellow-400 rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition dark:focus:ring-yellow-900 me-2"
              >
                {buttonLabel}
              </button>
              {isEditable && (
                <button
                  onClick={saveEdits}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition dark:focus:ring-blue-800 me-2"
                >
                  Save
                </button>
              )}
              <button
                onClick={exportData}
                className="px-5 py-2.5 text-sm font-medium text-white bg-green-700 rounded-full hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition dark:focus:ring-green-800 me-2"
              >
                Export
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-700 rounded-full hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition dark:focus:ring-red-900 me-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <HotTable
          className="custom-table"
          ref={BatchTableRef}
          settings={{
            data: batchdata,
            colHeaders: true,
            rowHeaders: true,
            stretchH: "all",
            dropdownMenu: true,
            contextMenu: true,
            filters: true,
            columnSorting: true,
            width: "100%",
            height: "80vh",
            licenseKey: "non-commercial-and-evaluation",
            cells: (row, col, prop) => {
              const cellProperties = {};
              if (batchdata[row] && batchdata[row][prop] === "INVALID") {
                cellProperties.renderer = "invalidCellRenderer";
              }
              return cellProperties;
            },
          }}
          style={{ width: "100%" }}
        />
      </div>
      <BatchUploadFile isOpen={isOpen} closeModal={closeModal} />
    </>
  );
};

export default BatchExcelTable;
