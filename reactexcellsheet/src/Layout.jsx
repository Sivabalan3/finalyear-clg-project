import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <section className="bg-white py-[70px] dark:bg-dark h-screen">
        <div className="mx-auto px-4 sm:container">
          <div>
            <Outlet />
          </div>
        </div>
      </section>

      <ul className="grid grid-flow-col text-center text-gray-500 bg-gray-100 rounded-lg p-1 mt-[40px] bottom-0 sticky">
        {/* <li>
          <NavLink
            to="/customer-order/"
            className={({ isActive }) =>
              `flex justify-center py-4 ${
                isActive
                  ? "bg-indigo-500  rounded-lg shadow text-white  font-bold text-2xl"
                  : "bg-gray-100"
              }`
            }
          >
            Success Order
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to="pending-order"
            className={({ isActive }) =>
              `flex justify-center py-4 ${
                isActive
                  ? "bg-indigo-500  rounded-lg shadow text-white  font-bold text-2xl"
                  : "bg-gray-100"
              }`
            }
          >
            Pending Order
          </NavLink>
        </li>
        <li>
          <NavLink
            to="out-of-stocks"
            className={({ isActive }) =>
              `flex justify-center py-4 ${
                isActive
                  ? "bg-indigo-500  rounded-lg shadow text-white  font-bold text-2xl"
                  : "bg-gray-100"
              }`
            }
          >
           EAN Not Matching
          </NavLink>
        </li>
        <li>
          <NavLink
            to="mis-match"
            className={({ isActive }) =>
              `flex justify-center py-4 ${
                isActive
                  ? "bg-indigo-500  rounded-lg shadow text-white  font-bold text-2xl"
                  : "bg-gray-100"
              }`
            }
          >
            Price Not Matching
          </NavLink>
        </li>
      </ul>
    </>
  );
}

export default Layout;
