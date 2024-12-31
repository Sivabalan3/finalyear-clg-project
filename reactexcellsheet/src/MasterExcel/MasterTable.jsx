import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Swal from "sweetalert2";
import axios from "axios";
import * as XLSX from "xlsx";
import Handsontable from "handsontable";
import {
  DeleteMasterFile,
  fetchExcelData,
} from "../store/masterexcelfile/masterExcelFileSlice";
import { useDispatch } from "react-redux";
import MasterUploadFile from "./MasterUploadFiles";

const DataTable = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const hotTableComponent = useRef(null);
  const dispatch = useDispatch();


   const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (data.length && hotTableComponent.current) {
      const headers = Object.keys(data[0]).filter(
        (header) => header !== "_id" && header !== "__v"
      );
      const columns = headers.map((header) => ({
        data: header,
        title: header,
        readOnly: !isEditable,
      }));

      hotTableComponent.current.hotInstance.updateSettings({
        data: data.map((row) => {
          const { _id, __v, ...filteredRow } = row;
          return filteredRow;
        }),
        colHeaders: headers,
        colWidths: 100,
        rowHeights: 30,
        columns: columns,
        dropdownMenu: true,
        contextMenu: {
          items: {
            row_above: { name: "Insert row above" },
            row_below: { name: "Insert row below" },
            col_left: { name: "Insert column left" },
            col_right: { name: "Insert column right" },
            remove_row: { name: "Remove row" },
            remove_col: { name: "Remove column" },
            undo: { name: "Undo" },
            redo: { name: "Redo" },
            make_read_only: { name: "Read only" },
            alignment: { name: "Alignment" },
          },
        },
        filters: true,
        columnSorting: true,
      });
    }
  }, [data, isEditable]);

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
        Swal.fire("Editing Enabled!", "You can now edit the table.", "success");
      }
    });
  };

  const saveData = async () => {
    if (!isEditable) {
      Swal.fire(
        "Edit First!",
        "You need to enable editing before saving.",
        "warning"
      );
      return;
    }

    const hotInstance = hotTableComponent.current.hotInstance;
    const updatedData = hotInstance.getData(); // Get data including headers

    // Include headers in the data
    const headers = hotInstance.getColHeader();
    const dataWithHeaders = [headers, ...updatedData];

   
    try {
      await axios.put("http://localhost:5000/api/excel/update", {
        data: dataWithHeaders,
      });
      Swal.fire("Saved!", "Your data has been updated.", "success");
    } catch (error) {
      console.error("Error saving data", error);
      Swal.fire("Error!", "There was an error saving your data.", "error");
    }
  };

  const exportData = () => {
    const hotInstance = hotTableComponent.current.hotInstance;
    const data = hotInstance.getData(); // Get the data including headers

    // Extract headers from Handsontable
    const headers = hotInstance.getColHeader(); // Get column headers

    // Create a JSON object with headers and data
    const dataWithHeaders = [headers, ...data];

    // Convert JSON object to worksheet
    const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write the workbook to a file
    XLSX.writeFile(wb, "spar article.xlsx");
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete the master file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(DeleteMasterFile()).unwrap();
          dispatch(fetchExcelData());
          Swal.fire("Deleted!", "The Master file has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting master file", error);
          Swal.fire("Error!", "Failed to delete master file.", "error");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your master file is safe :)", "error");
      }
    });
  };

  return (
    <>
      <div>
        <div className="flex py-7 justify-between">
          <div className="flex">
            <button
              onClick={openModal}
              className="focus:outline-none text-white bg-blue-700 hover:bg-blue-500 focus:ring-4 focus:ring-blue-700 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-blue-900 ml-10"
            >
              Upload A Master File
            </button>
            <div className="absolute right-5">

            <button
              onClick={enableEdit}
              className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
            >
              Enable Edit
            </button>
            <button
              onClick={exportData}
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Export
            </button>
            <button
              onClick={handleDelete}
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Delete
            </button>
        </div>
          </div>
        </div>
        <HotTable
          ref={hotTableComponent}
          settings={{
            data: data.map((row) => {
              const { _id, __v, ...filteredRow } = row;
              return filteredRow;
            }),
            colHeaders: true,
            rowHeaders: true,
            stretchH: "all",
            className: "custom-table",
            dropdownMenu: true,
            contextMenu: true,
            filters: true,
            columnSorting: true,
            width: "100%",
            height: "80vh",
            licenseKey: "non-commercial-and-evaluation",
          }}
          style={{ width: "100%" }}
        />
      </div>

      <MasterUploadFile isOpen={isOpen} closeModal={closeModal} />
    </>
  );
};

export default DataTable;
