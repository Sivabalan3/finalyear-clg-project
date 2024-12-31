import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Swal from "sweetalert2";
import axios from "axios";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerOutOfstocksOrder } from "../store/customerOrder/customerOrderSlice";

function OutOfStocksCustomerorder() {
  const dispatch = useDispatch();
  const {
    data: outofstocks,
    error,
    loading,
  } = useSelector((state) => state.customerExcel.getCustomerOutOfstocksOrder);
  const outofstocktable = useRef(null);

  useEffect(() => {
    dispatch(getCustomerOutOfstocksOrder());
  }, [dispatch]);

  // Effect to update Handsontable settings when data changes
  useEffect(() => {
    if (outofstocks && outofstocktable.current) {
      // Filter out the '_id' and '__v' keys
      const headers = outofstocks.length > 0 ? Object.keys(outofstocks[0]).filter(header => header !== '_id' && header !== '__v') : [];
      const columns = headers.map((header) => ({
        data: header,
        title: header,
        readOnly: true, // Set readOnly or other configurations as needed
      }));

      outofstocktable.current.hotInstance.updateSettings({
        data: outofstocks.map(order => {
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
        stretchH: "all",
        width: "100%",
        licenseKey: "non-commercial-and-evaluation",
      });
    }
  }, [outofstocks]);

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
    <div className="sticky top-5">

      <h1 className="text-indigo-500 font-extrabold text-3xl text-center">
        Out of Stock Customer Orders
      </h1>
      <HotTable
        className="custom-table"
        ref={outofstocktable}
        settings={{
          data: outofstocks.map(order => {
            const { _id, __v, ...filteredOrder } = order;
            return filteredOrder;
          }),
          colHeaders: true,
          rowHeaders: true,
          dropdownMenu: true,
          contextMenu: true,
          filters: true,
          stretchH: "all",
          columnSorting: true,
          width: "100%",
       height:'60vh',
          // height: "80vh",
          licenseKey: "non-commercial-and-evaluation",
        }}
        style={{ width: "100%" }}
      />
    </div>

    </>
  );
}

export default OutOfStocksCustomerorder;
