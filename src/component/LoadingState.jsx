import React from "react";
import itestifyLogo from "../assets/icons/logoloading.png";

const LoadingState = () => {
  return (
    <div className="fixed inset-0 z-[100] flex w-screen">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 w-screen"
        style={{ left: "270px" }}
        aria-hidden="true"
      />

      <div
        className="flex items-center justify-center w-full mt-[150px]"
        style={{ marginLeft: "270px" }}
      >
        <div className="relative z-10 w-24 h-24">
          {/* Full static border */}
          <div className="absolute inset-0 rounded-full border-[10px] border-gray-300"></div>
          
          {/* Spinning half-circle progress indicator */}
          <div
            className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-primary animate-spin origin-center"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
            }}
          ></div>

          {/* Static logo */}
          <img
            className="w-16 h-16 absolute inset-0 m-auto p-3"
            src={itestifyLogo}
            alt="Loading"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;