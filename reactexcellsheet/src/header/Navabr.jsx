import React from "react";
import { NavLink } from "react-router-dom";
import { FaExpand, FaCompress } from "react-icons/fa";
import { useState } from "react"; 

function Navbar() {
  const [isFullscreen, setIsFullscreen] = useState(false); 

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen); 
  };
  return (
    <ul className="grid grid-flow-col text-center border-b bg-gray-200 border-gray-200 text-gray-500 sticky top-0 z-50">
      <li>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "flex justify-center border-b-4 border-indigo-600 text-indigo-600 py-4"
              : "flex justify-center border-b-4 border-transparent hover:text-indigo-600 hover:border-indigo-600 py-4"
          }
        >
          Article Master
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/item-master"
          className={({ isActive }) =>
            isActive
              ? "flex justify-center border-b-4 border-indigo-600 text-indigo-600 py-4"
              : "flex justify-center border-b-4 border-transparent hover:text-indigo-600 hover:border-indigo-600 py-4"
          }
        >
          Master File
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/batch"
          className={({ isActive }) =>
            isActive
              ? "flex justify-center border-b-4 border-indigo-600 text-indigo-600 py-4"
              : "flex justify-center border-b-4 border-transparent hover:text-indigo-600 hover:border-indigo-600 py-4"
          }
        >
          Batch File
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/qutation"
          className={({ isActive }) =>
            isActive
              ? "flex justify-center border-b-4 border-indigo-600 text-indigo-600 py-4"
              : "flex justify-center border-b-4 border-transparent hover:text-indigo-600 hover:border-indigo-600 py-4"
          }
        >
          Quotation File
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/customer-order"
          className={({ isActive }) =>
            isActive
              ? "flex justify-center border-b-4 border-indigo-600 text-indigo-600 py-4"
              : "flex justify-center border-b-4 border-transparent hover:text-indigo-600 hover:border-indigo-600 py-4"
          }
        >
          Order File
        </NavLink>
      </li>
      <li>
      <button
        onClick={toggleFullscreen}
        className="flex absolute right-10 top-2 justify-center items-center border-b-4 border-transparent hover:text-indigo-600 hover:border-indigo-600 py-4"
      >
        {isFullscreen ? <FaCompress /> : <FaExpand />} {/* Display icon based on state */}
      </button>
      </li>
      {/* <li>
        <a
          href="#page5"
          className="flex justify-center border-b-4 border-transparent hover:text-indigo-600 hover:border-indigo-600 py-4"
        >
          Settings
        </a>
      </li> */}
    </ul>
  );
}

export default Navbar;
