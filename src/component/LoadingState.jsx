import React from "react";
import itestifyLogo from "../assets/icons/logoloading.png";

const LoadingState = () => {
  return (
    <div className="fixed inset-0 z-[70] flex">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        style={{ left: "270px" }}
        aria-hidden="true"
      />

      <div
        className="flex items-center justify-center w-full"
        style={{ marginLeft: "270px" }}
      >
        <div className="relative z-10 w-24 h-24">
          {/* Spinner ring */}
          <div className="absolute inset-0 rounded-full border-[10px] border-t-primary border-primary animate-spin " ></div>

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
