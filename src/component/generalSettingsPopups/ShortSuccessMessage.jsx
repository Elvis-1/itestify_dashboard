import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import CheckImage from "../../assets/images/CheckImage.png";
const ShortSuccessMessage = ({ successMessage }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div>
      <div className="fixed inset-0 z-50 ">
        {/* Non-clickable overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50`}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] shadow-2xl ">
          <div
            className={`rounded-lg p-6 py-12 modal ${
              isDarkMode ? "bg-near-black text-white" : "bg-white text-black"
            }`}
          >
            <div className="flex flex-col gap-3 text-center justify-center items-center">
              <img className="w-20" src={CheckImage} alt="" />
              <h3 className="text-lg">{successMessage}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortSuccessMessage;
