import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const showNotification = ({ title, message, type }) => {
  store.addNotification({
    content: (
      <div className="flex flex-col p-8 bg-white shadow-md hover:shadow-lg rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-16 h-16 rounded-2xl p-3 border ${
                type === "success"
                  ? "border-blue-100 text-blue-400 bg-blue-50"
                  : "border-red-100 text-red-400 bg-red-50"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  type === "success"
                    ? "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M18.364 5.636a9 9 0 11-12.728 12.728 9 9 0 0112.728-12.728z"
                }
              ></path>
            </svg>
            <div className="flex flex-col ml-3">
              <div className="font-medium leading-none">{title}</div>
              <p className="text-sm text-gray-600 leading-none mt-1">
                {message}
              </p>
            </div>
          </div>
          <button
            className={`flex-no-shrink ${
              type === "success"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-red-500 text-white border-red-500"
            } px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 rounded-full`}
          >
            {type === "success" ? "OK" : "Dismiss"}
          </button>
        </div>
      </div>
    ),
    container: "top-right",
    dismiss: {
      duration: 3000,
      onScreen: true,
    },
    type,
  });
};

export default showNotification;
