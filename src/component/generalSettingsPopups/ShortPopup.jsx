import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
const ShortPopup = ({successMessage}) => {
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm shadow-2xl ">
          <div
            className={`rounded-lg p-6 py-12 modal ${
              isDarkMode ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            <div className="flex flex-col gap-3 text-center justify-center items-center">
              <p
                className={`text-sm opacity-70 ${
                  isDarkMode ? "text-off-white" : "text-off-black"
                }`}
              >
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortPopup;
