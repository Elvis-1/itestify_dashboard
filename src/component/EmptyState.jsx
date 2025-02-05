import React, { useContext } from "react";
import nodata from "../assets/images/No-data.png";
import { DarkModeContext } from "../context/DarkModeContext";
import noDataLightMode from "../assets/images/Nodata-lightmode.png";
const EmptyState = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div className="grid place-items-center">
      <div
        className={`w-full flex flex-col justify-between gap-16 ${
          isDarkMode ? `text-off-white` : `text-black`
        }`}
      >
        <div className="flex justify-center items-center mt-6">
          <img
            src={isDarkMode ? nodata : noDataLightMode}
            alt=""
            width={100}
            height={100}
          />
        </div>

        <div className="flex justify-between items-center w-full p-5 ">
          <p>Showing 0 of 0</p>
          <div className="flex gap-2 items-center ">
            <button
              className={`btn-secondary cursor-not-allowed ${
                isDarkMode ? `text-off-white` : `text-black border-black`
              }`}
            >
              Previous
            </button>
            <button
              className={`btn-secondary cursor-not-allowed ${
                isDarkMode ? `text-off-white` : `text-black border-black`
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
