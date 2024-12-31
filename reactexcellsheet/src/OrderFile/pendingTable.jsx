// import React, { useState, useRef, useEffect } from "react";
// import { HotTable } from "@handsontable/react";
// import "handsontable/dist/handsontable.full.css";
// import Swal from "sweetalert2";
// import { useDispatch, useSelector } from "react-redux";
// import { getCustomerPendingData } from "../store/customerOrder/customerOrderSlice";

// function OrderPendingTable() {
//   const dispatch = useDispatch();
//   const {
//     data: pendingorder,
//     error,
//     loading,
//   } = useSelector((state) => state.customerExcel.getCustomerPendingData);
//   const pendingTable = useRef(null);

//   useEffect(() => {
//     dispatch(getCustomerPendingData());
//   }, [dispatch]);

//   // Function to filter out duplicates based on ItemCode
//   const filterUniqueItemCodeData = (data) => {
//     const uniqueItemCodeMap = new Map();
//     data.forEach((item) => {
//       uniqueItemCodeMap.set(item.ItemCode, item); // This will keep the last item for each ItemCode
//     });
//     return Array.from(uniqueItemCodeMap.values()); // Convert the map back to an array
//   };

//   // Effect to update Handsontable settings when data changes
//   useEffect(() => {
//     if (pendingorder && pendingTable.current) {
//       const filteredPendingOrder = filterUniqueItemCodeData(pendingorder);
      
//       // Filter out the '_id' and '__v' keys
//       const headers =
//         filteredPendingOrder.length > 0
//           ? Object.keys(filteredPendingOrder[0]).filter(
//               (header) => header !== "_id" && header !== "__v"
//             )
//           : [];
//       const columns = headers.map((header) => ({
//         data: header,
//         title: header,
//         readOnly: true,
//       }));

//       pendingTable.current.hotInstance.updateSettings({
//         data: filteredPendingOrder.map((order) => {
//           const { _id, __v, ...filteredOrder } = order;
//           return filteredOrder;
//         }),
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
//   }, [pendingorder]);

//   if (loading)
//     return (
//       <div className="w-full gap-x-2 flex justify-center items-center h-screen my-auto justify-center">
//         <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
//         <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
//         <div className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
//       </div>
//     );

//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <>
//       <div className="sticky top-5">
//         <h1 className="text-indigo-500 font-extrabold text-3xl text-center ">
//           Pending Order
//         </h1>
//         <HotTable
//           className="custom-table"
//           ref={pendingTable}
//           settings={{
//             data: pendingorder.map((order) => {
//               const { _id, __v, ...filteredOrder } = order;
//               return filteredOrder;
//             }),
//             colHeaders: true,
//             rowHeaders: true,
//             dropdownMenu: true,
//             contextMenu: true,
//             filters: true,
//             columnSorting: true,
//             stretchH: "all",
//             width: "100%",
//             height: "60vh",
//             licenseKey: "non-commercial-and-evaluation",
//           }}
//           style={{ width: "100%" }}
//         />
//       </div>
//     </>
//   );
// }

// export default OrderPendingTable;
import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Swal from "sweetalert2";
import axios from "axios";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerPendingData } from "../store/customerOrder/customerOrderSlice";

function OrderPendingTable() {
  const dispatch = useDispatch();
  const {
    data: pendingorder,
    error,
    loading,
  } = useSelector((state) => state.customerExcel.getCustomerPendingData);
  const pendingTable = useRef(null);

  useEffect(() => {
    dispatch(getCustomerPendingData());
  }, [dispatch]);

  // Effect to update Handsontable settings when data changes
  useEffect(() => {
    if (pendingorder && pendingTable.current) {
      // Filter out the '_id' and '__v' keys
      const headers =
        pendingorder.length > 0
          ? Object.keys(pendingorder[0]).filter(
              (header) => header !== "_id" && header !== "__v"
            )
          : [];
      const columns = headers.map((header) => ({
        data: header,
        title: header,
        readOnly: true,
      }));

      pendingTable.current.hotInstance.updateSettings({
        data: pendingorder.map((order) => {
          const { _id, __v, ...filteredOrder } = order;
          return filteredOrder;
        }),
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
  }, [pendingorder]);

  if (loading)
    return (
      <div className="w-full gap-x-2 flex justify-center items-center h-screen my-auto justify-center">
        <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
        <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
        <div className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
      </div>
    );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="sticky ">
        <h1 className="text-indigo-500 font-extrabold text-3xl text-center ">
          Pending Order
        </h1>
        <HotTable
          className="custom-table"
          ref={pendingTable}
          settings={{
            data: pendingorder.map((order) => {
              const { _id, __v, ...filteredOrder } = order;
              return filteredOrder;
            }),
            colHeaders: true,
            rowHeaders: true,
            dropdownMenu: true,
            contextMenu: true,
            filters: true,
            columnSorting: true,
            stretchH: "all",
            width: "100%",
            height: "65vh",
            licenseKey: "non-commercial-and-evaluation",
          }}
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
}

export default OrderPendingTable;
