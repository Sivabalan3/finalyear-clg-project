import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArticleTypes, deleteArticles } from "../store/Articlemaster/ArticlemasterSlice"; 
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const ArticlemasterDynamicTable = forwardRef(({ Articletype }, ref) => {
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, data: articleData = [] } = useSelector((state) => state.articlemaster.getArticleTypes); // Default to an empty array
  const hotTableComponent = useRef(null);

  useEffect(() => {
    if (Articletype) {
      dispatch(getArticleTypes({ articleType: Articletype }));
    }
  }, [dispatch, Articletype]);

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
          Swal.fire("Editing Enabled!", "You can now edit the table.", "success");
        }
      });
    },
    handleExportData: () => {
      const hotInstance = hotTableComponent.current.hotInstance;
      const data = hotInstance.getData();
      const headers = hotInstance.getColHeader();
      const dataWithHeaders = [headers, ...data];
    
      // Dynamically generate the filename based on `Articletype` or other backend data
      let filename = `${Articletype}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
      // If you need more dynamic logic, you can fetch it from the backend or state:
      // const filename = `${Articletype}_data_${someAdditionalData}.xlsx`;
    
      const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    
      // Export the file with the dynamically generated filename
      XLSX.writeFile(wb, filename);
    },
    
    handleDeleteData: () => {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete the entire file?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteArticles({ articleType: Articletype }))
            .then((response) => {
              if (response.meta.requestStatus === 'fulfilled') {
                Swal.fire('Deleted!', 'The file has been deleted.', 'success');
                dispatch(getArticleTypes([]))
              } else {
                Swal.fire('Error!', 'There was an error deleting the file.', 'error');
              }
            })
            .catch(() => {
              Swal.fire('Error!', 'There was an error deleting the file.', 'error');
            });
        }
      });
    },
  }));

  useEffect(() => {
    if (articleData.length && hotTableComponent.current) {
      const headers = Object.keys(articleData[0]).filter(
        (header) => header !== "_id" && header !== "__v"
      );
      const columns = headers.map((header) => ({
        data: header,
        title: header,
        readOnly: !isEditable,
      }));

      hotTableComponent.current.hotInstance.updateSettings({
        data: articleData.map((row) => {
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
  }, [articleData, isEditable]);

  if (loading)
    return (
      <div className="w-full gap-x-2 flex items-center h-screen my-auto justify-center">
        <div className="w-5 bg-[#d991c2]  h-5 rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
        <div className="w-5 h-5  bg-[#6756cc] rounded-full animate-bounce"></div>
      </div>
    );

  if (error) return <p>Error: {error}</p>;
  if (!Articletype || (Articletype !== "D-mart" && Articletype !== "Spaar")) {
    return (
      <section className="flex items-center h-screen p-16 bg-gray-50 dark:bg-gray-700">
        <div className="container flex flex-col items-center">
          <div className="flex flex-col gap-6 max-w-md text-center">
            <h2 className="font-extrabold text-9xl text-gray-600 dark:text-gray-100">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-2xl md:text-3xl dark:text-gray-300">Please select a valid Article File</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {articleData.length > 0 ? (
        <HotTable
          ref={hotTableComponent}
          settings={{
            data: articleData.map((row) => {
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
      ) : (
        <p>No article data available</p>
      )}
    </>
  );
});

ArticlemasterDynamicTable.displayName = "ArticlemasterDynamicTable";

export default ArticlemasterDynamicTable;
