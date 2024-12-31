import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQutationsByType } from "../store/Qutationfile/QutationSlice";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import { HotTable } from "@handsontable/react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
const Base_Url = import.meta.env.VITE_BASE_URL;
const QuotationTable = forwardRef(({ QutationType }, ref) => {
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useDispatch();
  const {
    data: QutationData,
    loading,
    error,
  } = useSelector((state) => state.Qutation.fetchedQutations);
  const hotTableComponent = useRef(null);

  useEffect(() => {
    if (QutationType) {
      dispatch(fetchQutationsByType({ QutationType: QutationType }));
    }
  }, [dispatch, QutationType]);

  useImperativeHandle(ref, () => ({
    handleEnableEdit: () => {
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
          Swal.fire(
            "Editing Enabled!",
            "You can now edit the table.",
            "success"
          );
        }
      });
    },
    handleExportData: () => {
      const hotInstance = hotTableComponent.current.hotInstance;
      const data = hotInstance.getData();
      const headers = hotInstance.getColHeader();
      const dataWithHeaders = [headers, ...data];
      const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "spar_article.xlsx");
      XLSX.writeFile(wb, "spar_article.xlsx");
    },
    handleDeleteAllData: async () => {
      const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "This will delete all quotations. This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete All",
        cancelButtonText: "Cancel",
      });

      if (confirmDelete.isConfirmed) {
        await deleteAllQuotationsFromBackend();

        hotTableComponent.current.hotInstance.loadData([]);

        Swal.fire("Deleted!", "All quotations have been deleted.", "success");
      }
    },
  }));

  const deleteAllQuotationsFromBackend = async () => {
    try {
      const response = await fetch(`${Base_Url}/api/excel/qutation/delete/all`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete all quotations");
      }
    } catch (error) {
      console.error("Error deleting quotations from backend:", error);
      Swal.fire("Error", "Failed to delete all quotations from backend", "error");
    }
  };

  useEffect(() => {
    if (QutationData.length && hotTableComponent.current) {
      const headers = Object.keys(QutationData[0]).filter(
        (header) => header !== "_id" && header !== "__v"
      );
      const columns = headers.map((header) => ({
        data: header,
        title: header,
        readOnly: !isEditable,
      }));

      hotTableComponent.current.hotInstance.updateSettings({
        data: QutationData.map((row) => {
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
  }, [QutationData, isEditable]);

  if (loading)
    return (
      <div className="w-full gap-x-2 flex justify-center items-center h-screen my-auto justify-center">
        <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
        <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
        <div className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
      </div>
    );

  if (error) return <p>Error: {error}</p>;
  if (
    !QutationType ||
    (QutationType !== "D-martqutation" && QutationType !== "SPAR-qutation")
  ) {
    return (
      <section className="flex items-center h-screen p-16 bg-gray-50 dark:bg-gray-700">
        <div className="container flex flex-col items-center">
          <div className="flex flex-col gap-6 max-w-md text-center">
            <h2 className="font-extrabold text-9xl text-gray-600 dark:text-gray-100">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-2xl md:text-3xl dark:text-gray-300">
              Please select a valid Article File
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <HotTable
        ref={hotTableComponent}
        settings={{
          data: QutationData.map((row) => {
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
    </>
  );
});

QuotationTable.displayName = "QuotationTable";


export default QuotationTable;
