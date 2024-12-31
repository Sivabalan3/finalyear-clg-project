import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchExcelData } from "../store/masterexcelfile/masterExcelFileSlice";
import DataTable from "./MasterTable";

const ItemMasterHome = () => {
  const dispatch = useDispatch();

  // Ensure the state path is correct and matches your Redux state structure
  const { data, loading, error } = useSelector(
    (state) => state.masterExcel.fetchedData
  );

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchExcelData());
  }, [dispatch]);

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
      <div className="App mt-3">
        <h1 className="text-indigo-500 font-extrabold text-3xl text-center">
          Item Master Excel Upload and Display
        </h1>

        {data && <DataTable data={data} />}
      </div>
    </>
  );
};

export default ItemMasterHome;
