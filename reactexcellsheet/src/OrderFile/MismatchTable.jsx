import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomervalueMismatchdata } from '../store/customerOrder/customerOrderSlice';
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";

function MismatchTable() {
  const { data: MismatchData, loading, error } = useSelector((state) => state.customerExcel.getCustomervalueMismatchdata);
  const dispatch = useDispatch();
  const misMatchValueTable = useRef(null);

  useEffect(() => {
    dispatch(getCustomervalueMismatchdata());
  }, [dispatch]);

  useEffect(() => {
    if (MismatchData.length && misMatchValueTable.current) {
      const headers = Object.keys(MismatchData[0]).filter(
        (header) => header !== "_id" && header !== "__v"
      );

      const columns = headers.map((header) => ({
        data: header,
        title: header,
      }));

      misMatchValueTable.current.hotInstance.updateSettings({
        data: MismatchData.map((row) => {
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
  }, [MismatchData]);

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
    <div className='sticky top-5'>

      <h1 className="text-indigo-500 font-extrabold text-3xl text-center">
        Mismatch value
      </h1>
      <HotTable
        className="custom-table"
        ref={misMatchValueTable}
        data={MismatchData.map(order => {
          const { _id, __v, ...filteredOrder } = order;
          return filteredOrder;
        })}
        colHeaders
        rowHeaders
        dropdownMenu
        contextMenu
        filters
        columnSorting
        stretchH="all"
        width="100%"
        height="60vh"
        licenseKey="non-commercial-and-evaluation"
        style={{ width: "100%" }}
      />
    </div>
    </>
  );
}

export default MismatchTable;
