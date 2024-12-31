
// import React, { useState, useRef, useEffect } from "react";
// import { HotTable } from "@handsontable/react";
// import "handsontable/dist/handsontable.full.css";
// import Swal from "sweetalert2";
// import * as XLSX from "xlsx";
// import CustomerArticleExcelUpload from "./CustomerOrderUpload";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   DeleteOrderFile,
//   getCustomerExcelData,
// } from "../store/customerOrder/customerOrderSlice";
// import ExportModal from "./ExportModel"; // Import the modal component
// import OrderPendingTable from "./pendingTable";
// import ExcelJS from 'exceljs';

// const CustomerArticleTable = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false); // State for export modal

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);
//   const closeExportModal = () => setIsExportModalOpen(false); // Close export modal
//   const openExportModal = () => setIsExportModalOpen(true); // Open export modal

//   const dispatch = useDispatch();
//   const { data: customerArticle, loading } = useSelector(
//     (state) => state.customerExcel.getCustomerExcelData
//   );
//   const { data: pendingorder } = useSelector(
//     (state) => state.customerExcel.getCustomerPendingData
//   ); // Select pending order data

//   const { data: outOfStockData } = useSelector(
//     (state) => state.customerExcel.getCustomerOutOfstocksOrder 
//   );
//   const { data: mismatchValueData } = useSelector(
//     (state) => state.customerExcel.getCustomervalueMismatchdata 
//   );

//   const [isEditable, setIsEditable] = useState(false);
//   const CustomerArticleTable = useRef(null);
//   const [customerData, setCustomerData] = useState([]);

//   useEffect(() => {
//     dispatch(getCustomerExcelData());
//   }, [dispatch]);

//  // Function to filter out duplicates based on ItemCode
//   const filterUniqueItemCodeData = (data) => {
//     const uniqueItemCodeMap = new Map();
//     data.forEach(item => {
//       uniqueItemCodeMap.set(item.ItemCode, item); // This will replace any previous item with the same ItemCode
//     });
//     return Array.from(uniqueItemCodeMap.values()); // Convert the map back to an array
//   };


//   useEffect(() => {
//     if (customerArticle) {
//       const filteredData = filterUniqueItemCodeData(customerArticle.map(({ _id, __v, ...rest }) => rest));
//       setCustomerData(filteredData);
//     }
//   }, [customerArticle]);

//   useEffect(() => {
//     if (customerData.length && CustomerArticleTable.current) {
//       const headers = Object.keys(customerData[0]);
//       const columns = headers.map((header) => ({
//         data: header,
//         title: header,
//         readOnly: !isEditable,
//       }));

//       CustomerArticleTable.current.hotInstance.updateSettings({
//         data: customerData,
//         colHeaders: headers,
//         columns: columns,
//         colWidths: 100,
//         rowHeights: 30,
//         dropdownMenu: true,
//         contextMenu: true,
//         filters: true,
//         columnSorting: true,
//       });
//     }
//   }, [customerData, isEditable]);

//   const enableEdit = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to enable editing?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, enable it!",
//       cancelButtonText: "No, keep it read-only",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setIsEditable(true);
//         Swal.fire("Editing Enabled!", "You can now edit the table.", "success");
//       }
//     });
//   };

//   const saveEdits = () => {
//     // Implement save logic here
//     Swal.fire("Saved!", "Changes have been saved.", "success");
//     setIsEditable(false);
//   };

//   const exportData = async (fileName, selectedType, poNumber, poDate) => {
//     // Function to filter out _id and __v from an array of objects
//     const filterData = (data) => {
//       return data.map(({ _id, __v, ...filteredRow }) => filteredRow);
//     };
  
//     // Filter customerData
//     const filteredCustomerData = filterData(customerData);
//     const headersCustomer = Object.keys(filteredCustomerData[0]);
  
//     // Create a new workbook and add a worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Orders');
  
//     // Define a consistent style for all headings and table headers
//     const headingStyle = {
//       font: { bold: true, size: 14 }, // Bold and font size 14
//       alignment: { horizontal: 'center' }, // Center alignment
//     };
  
//     // Define a style for all data rows
//     const dataStyle = {
//       alignment: { horizontal: 'center' }, // Center alignment for data
//     };
  
//     // Function to apply heading style to a row
//     const applyStyleToRow = (row, isHeading = false) => {
//       row.eachCell((cell) => {
//         if (isHeading) {
//           cell.style = headingStyle; // Apply heading style
//         } else {
//           cell.style = dataStyle; // Apply data style
//         }
//       });
//     };
  
//     // Add the Purchase Order details at the top of the worksheet
//     // const customerOrderHeader = worksheet.addRow(["Customer Order Data"]);
//     // applyStyleToRow(customerOrderHeader, true); // Apply heading style
  
//     // Add PO Number and PO Date rows and apply styles
//     const poNumberRow = worksheet.addRow([`PO Number: ${poNumber}`]);
//     applyStyleToRow(poNumberRow, true); // Apply style to PO Number row
  
//     const poDateRow = worksheet.addRow([`PO Date: ${poDate}`]);
//     applyStyleToRow(poDateRow, true); // Apply style to PO Date row
  
//     worksheet.addRow([]); // Empty row for spacing
//     const SuccessHeader = worksheet.addRow(["Success Order Data"]);
//     applyStyleToRow(SuccessHeader, true); // Apply heading style
//     worksheet.addRow([]); // Empty row for spacing
//     // Add headers for customer data and apply styles
//     const customerHeadersRow = worksheet.addRow(headersCustomer); 
//     applyStyleToRow(customerHeadersRow, true); // Style the headers
  
//     // Add customer data rows to the worksheet
//     filteredCustomerData.forEach((row) => {
//       const dataRow = worksheet.addRow(Object.values(row));
//       applyStyleToRow(dataRow); // Apply data style
//     });
  
//     // Add and style Pending Order Data heading
//     worksheet.addRow([]); // Empty row
//     const pendingHeader = worksheet.addRow(["Pending Order Data"]);
//     applyStyleToRow(pendingHeader, true); // Apply heading style
//     worksheet.addRow([]);
//     // Filter and add pending order data headers and rows
//     const filteredPendingOrder = filterData(pendingorder);
//     if (filteredPendingOrder.length > 0) {
//       const pendingHeadersRow = worksheet.addRow(Object.keys(filteredPendingOrder[0]));
//       applyStyleToRow(pendingHeadersRow, true); // Style the headers of Pending Orders
  
//       filteredPendingOrder.forEach((row) => {
//         const dataRow = worksheet.addRow(Object.values(row));
//         applyStyleToRow(dataRow); // Apply data style
//       });
//     }
  
//     // Add and style Out of Stock Data heading
//     worksheet.addRow([]);
//     const outOfStockHeader = worksheet.addRow(["EAN Not Matching"]);
//     applyStyleToRow(outOfStockHeader, true); // Apply heading style
//     worksheet.addRow([]);
//     // Filter and add out of stock data headers and rows
//     const filteredOutOfStockData = filterData(outOfStockData);
//     if (filteredOutOfStockData.length > 0) {
//       const outOfStockHeadersRow = worksheet.addRow(Object.keys(filteredOutOfStockData[0]));
//       applyStyleToRow(outOfStockHeadersRow, true); // Style the headers of Out of Stock Data
  
//       filteredOutOfStockData.forEach((row) => {
//         const dataRow = worksheet.addRow(Object.values(row));
//         applyStyleToRow(dataRow); // Apply data style
//       });
//     }
  
//     // Add and style Mismatch Value Data heading
//     worksheet.addRow([]);
//     const mismatchHeader = worksheet.addRow(["Mismatch Value Data"]);
//     applyStyleToRow(mismatchHeader, true); // Apply heading style
  
//     // Filter and add mismatch value data headers and rows
//     const filteredMismatchValueData = filterData(mismatchValueData);
//     if (filteredMismatchValueData.length > 0) {
//       const mismatchHeadersRow = worksheet.addRow(Object.keys(filteredMismatchValueData[0]));
//       applyStyleToRow(mismatchHeadersRow, true); // Style the headers of Mismatch Value Data
  
//       filteredMismatchValueData.forEach((row) => {
//         const dataRow = worksheet.addRow(Object.values(row));
//         applyStyleToRow(dataRow); // Apply data style
//       });
//     }
  
//     // Adjust column widths to fit content and ensure the heading remains centered
//     worksheet.columns.forEach((column) => {
//       column.width = 25; // Adjust width as needed
//     });
  
//     // Generate Excel file as a Blob for download in browser
//     try {
//       const buffer = await workbook.xlsx.writeBuffer();
//       const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
//       // Create a download link
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
  
//       const time = new Date();
//       const day = time.getDate();
//       const month = time.getMonth() + 1;
//       const year = time.getFullYear();
//       let hours = time.getHours();
//       const minutes = String(time.getMinutes()).padStart(2, '0');
//       const amPm = hours >= 12 ? 'PM' : 'AM';
//       hours = hours % 12;
//       hours = hours ? String(hours).padStart(2, '0') : '12';
//       const formattedTime = `${hours}:${minutes} ${amPm}`;
//       const formattedDate = `${day}-${month}-${year} ${formattedTime}`;
  
//       link.download = `${fileName}__${formattedDate}.xlsx`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error exporting Excel file:', error);
//     }
//   };
//   const handleDelete = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete all orders?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete!",
//       cancelButtonText: "No, cancel!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         dispatch(DeleteOrderFile());
//         setCustomerData([]);
//         Swal.fire("Deleted!", "All order files have been deleted.", "success");
//       }
//     });
//   };
//   return (
//     <div className="mt-3 sticky top-5 m">
//     <h1 className="text-indigo-600 font-extrabold text-3xl text-center pb-4">
//       Success Order
//     </h1>
//     <div className="flex justify-between items-center py-4 -mt-16">
//       <button
//         type="button"
//         onClick={openModal}
//         className="px-5 py-2.5 mt-2 rounded-full bg-blue-600 text-white text-sm font-semibold tracking-wide hover:bg-blue-700"
//       >
//         Upload Order Po
//       </button>
//       <CustomerArticleExcelUpload isOpen={isOpen} closeModal={closeModal} />
//       <div className="flex gap-4 items-center">
//         <button
//           onClick={enableEdit}
//           className="px-5 py-2.5 bg-lime-500 text-white rounded-full text-sm font-medium hover:bg-lime-600"
//         >
//           Edit
//         </button>
//         <button
//           onClick={openExportModal} // Open the export modal
//           className="px-5 py-2.5 bg-yellow-500 text-white rounded-full text-sm font-medium hover:bg-yellow-600"
//         >
//           Export
//         </button>
//         <button
//           onClick={handleDelete}
//           className="px-5 py-2.5 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//     <HotTable
//       className="custom-table"
//       ref={CustomerArticleTable}
//       settings={{
//         data: customerData,
//         colHeaders: true,
//         rowHeaders: true,
//         dropdownMenu: true,
//         stretchH: "all",
//         contextMenu: true,
//         filters: true,
//         columnSorting: true,
//         width: "100%",
//         height: "60vh",
//         licenseKey: "non-commercial-and-evaluation",
//       }}
//       style={{ width: "100%" }}
//     />
//     <ExportModal
//       isOpen={isExportModalOpen}
//       onClose={closeExportModal}
//       onExport={exportData} 
//     />
//   </div>
//   );
// };

// export default CustomerArticleTable;

import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import CustomerArticleExcelUpload from "./CustomerOrderUpload";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteOrderFile,
  getCustomerExcelData,
} from "../store/customerOrder/customerOrderSlice";
import ExportModal from "./ExportModel"; // Import the modal component
import OrderPendingTable from "./pendingTable";
import ExcelJS from 'exceljs';

const CustomerArticleTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false); // State for export modal

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const closeExportModal = () => setIsExportModalOpen(false); // Close export modal
  const openExportModal = () => setIsExportModalOpen(true); // Open export modal

  const dispatch = useDispatch();
  const { data: customerArticle, loading } = useSelector(
    (state) => state.customerExcel.getCustomerExcelData
  );
  const { data: pendingorder } = useSelector(
    (state) => state.customerExcel.getCustomerPendingData
  ); // Select pending order data

  const {data:outOfStockData} = useSelector(
    (state) => state.customerExcel.getCustomerOutOfstocksOrder 
  )
  const {data:mismatchValueData} = useSelector(
    (state) => state.customerExcel.getCustomervalueMismatchdata 
  )
  
  const [isEditable, setIsEditable] = useState(false);
  const CustomerArticleTable = useRef(null);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    dispatch(getCustomerExcelData());
  }, [dispatch]);

  useEffect(() => {
    if (customerArticle) {
      const filteredData = customerArticle.map(({ _id, __v, ...rest }) => rest);
      setCustomerData(filteredData);
    }
  }, [customerArticle]);
  

  useEffect(() => {
    if (customerData.length && CustomerArticleTable.current) {
      const headers = Object.keys(customerData[0]);
      const columns = headers.map((header) => ({
        data: header,
        title: header,
        readOnly: !isEditable,
      }));

      CustomerArticleTable.current.hotInstance.updateSettings({
        data: customerData,
        colHeaders: headers,
        columns: columns,
        colWidths: 100,
        rowHeights: 30,
        dropdownMenu: true,
        contextMenu: true,
        filters: true,
        columnSorting: true,
      });
    }
  }, [customerData, isEditable]);

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

  const saveEdits = () => {
    // Implement save logic here
    Swal.fire("Saved!", "Changes have been saved.", "success");
    setIsEditable(false);
  };

 



const exportData = async (fileName, selectedType, poNumber, poDate) => {
  // Function to filter out _id and __v from an array of objects
  const filterData = (data) => {
    return data.map(({ _id, __v, ...filteredRow }) => filteredRow);
  };

  // Filter customerData
  const filteredCustomerData = filterData(customerData);
  const headersCustomer = Object.keys(filteredCustomerData[0]);

  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  // Define a consistent style for all headings and table headers
  const headingStyle = {
    font: { bold: true, size: 14 }, // Bold and font size 14
    alignment: { horizontal: 'center' }, // Center alignment
  };

  // Define a style for all data rows
  const dataStyle = {
    alignment: { horizontal: 'center' }, // Center alignment for data
  };

  // Function to apply heading style to a row
  const applyStyleToRow = (row, isHeading = false) => {
    row.eachCell((cell) => {
      if (isHeading) {
        cell.style = headingStyle; // Apply heading style
      } else {
        cell.style = dataStyle; // Apply data style
      }
    });
  };

  // Add the Purchase Order details at the top of the worksheet
  const customerOrderHeader = worksheet.addRow(["Customer Order Data"]);
  applyStyleToRow(customerOrderHeader, true); // Apply heading style

  // Add PO Number and PO Date rows and apply styles
  const poNumberRow = worksheet.addRow([`PO Number: ${poNumber}`]);
  applyStyleToRow(poNumberRow, true); // Apply style to PO Number row

  const poDateRow = worksheet.addRow([`PO Date: ${poDate}`]);
  applyStyleToRow(poDateRow, true); // Apply style to PO Date row

  worksheet.addRow([]); // Empty row for spacing
 // Empty row
  const ScessHeader = worksheet.addRow(["Sucess Order Data"]);
  applyStyleToRow(ScessHeader, true); // Apply heading style
  worksheet.addRow([]); 
  // Add headers for customer data and apply styles
  const customerHeadersRow = worksheet.addRow(headersCustomer); 
  applyStyleToRow(customerHeadersRow, true); // Style the headers

  // Add customer data rows to the worksheet
  filteredCustomerData.forEach((row) => {
    const dataRow = worksheet.addRow(Object.values(row));
    applyStyleToRow(dataRow); // Apply data style
  });

  // Add and style Pending Order Data heading
  worksheet.addRow([]); // Empty row
  const pendingHeader = worksheet.addRow(["Pending Order Data"]);
  applyStyleToRow(pendingHeader, true); // Apply heading style

  // Filter and add pending order data headers and rows
  const filteredPendingOrder = filterData(pendingorder);
  if (filteredPendingOrder.length > 0) {
    const pendingHeadersRow = worksheet.addRow(Object.keys(filteredPendingOrder[0]));
    applyStyleToRow(pendingHeadersRow, true); // Style the headers of Pending Orders

    filteredPendingOrder.forEach((row) => {
      const dataRow = worksheet.addRow(Object.values(row));
      applyStyleToRow(dataRow); // Apply data style
    });
  }

  // Add and style Out of Stock Data heading
  // worksheet.addRow([]);
  // const outOfStockHeader = worksheet.addRow(["Out of Stock Data"]);
  // applyStyleToRow(outOfStockHeader, true); // Apply heading style

  // Filter and add out of stock data headers and rows
  const filteredOutOfStockData = filterData(outOfStockData);
  if (filteredOutOfStockData.length > 0) {
    const outOfStockHeadersRow = worksheet.addRow(Object.keys(filteredOutOfStockData[0]));
    applyStyleToRow(outOfStockHeadersRow, true); // Style the headers of Out of Stock Data

    filteredOutOfStockData.forEach((row) => {
      const dataRow = worksheet.addRow(Object.values(row));
      applyStyleToRow(dataRow); // Apply data style
    });
  }

  // Add and style Mismatch Value Data heading
  worksheet.addRow([]);
  const mismatchHeader = worksheet.addRow(["Mismatch Value Data"]);
  applyStyleToRow(mismatchHeader, true); // Apply heading style

  // Filter and add mismatch value data headers and rows
  const filteredMismatchValueData = filterData(mismatchValueData);
  if (filteredMismatchValueData.length > 0) {
    const mismatchHeadersRow = worksheet.addRow(Object.keys(filteredMismatchValueData[0]));
    applyStyleToRow(mismatchHeadersRow, true); // Style the headers of Mismatch Value Data

    filteredMismatchValueData.forEach((row) => {
      const dataRow = worksheet.addRow(Object.values(row));
      applyStyleToRow(dataRow); // Apply data style
    });
  }

  // Adjust column widths to fit content and ensure the heading remains centered
  worksheet.columns.forEach((column) => {
    column.width = 25; // Adjust width as needed
  });

  // Generate Excel file as a Blob for download in browser
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    const time = new Date();
    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';
    const formattedTime = `${hours}:${minutes} ${amPm}`;
    const formattedDate = `${day}-${month}-${year} ${formattedTime}`;

    link.download = `${fileName}_${selectedType}__${formattedDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting Excel file:', error);
  }
};

  
  
  
  

  if (loading)
    return (
      <div className="w-full gap-x-2 flex justify-center items-center h-screen my-auto justify-center">
        <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
        <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
        <div className="w-5 h-5 animate-pulse bg-[#58c5c4] rounded-full animate-bounce"></div>
      </div>
    );

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete all orders?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DeleteOrderFile());
        setCustomerData([]);
        Swal.fire("Deleted!", "All order files have been deleted.", "success");
      }
    });
  };

  return (
    <div className="-mt-12 sticky top-5">
      <h1 className="text-indigo-600 font-extrabold text-3xl text-center pb-4">
        Success Order
      </h1>
      <div className="flex justify-between items-center py-4 -mt-16">
        <button
          type="button"
          onClick={openModal}
          className="px-5 py-2.5 mt-2 rounded-full bg-blue-600 text-white text-sm font-semibold tracking-wide hover:bg-blue-700"
        >
          Upload Order PO
        </button>
        <CustomerArticleExcelUpload isOpen={isOpen} closeModal={closeModal} />
        <div className="flex gap-4 items-center">
          <button
            onClick={enableEdit}
            className="px-5 py-2.5 bg-lime-500 text-white rounded-full text-sm font-medium hover:bg-lime-600"
          >
            Update
          </button>
          <button
            onClick={openExportModal} // Open the export modal
            className="px-5 py-2.5 bg-yellow-500 text-white rounded-full text-sm font-medium hover:bg-yellow-600"
          >
            Export
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      <HotTable
        className="custom-table"
        ref={CustomerArticleTable}
        settings={{
          data: customerData,
          colHeaders: true,
          rowHeaders: true,
          dropdownMenu: true,
          stretchH: "all",
          contextMenu: true,
          filters: true,
          columnSorting: true,
          width: "100%",
          height: "70vh",
          licenseKey: "non-commercial-and-evaluation",
        }}
        style={{ width: "100%" }}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        onExport={exportData} // Pass the export function
      />
    </div>
  );
};

export default CustomerArticleTable;