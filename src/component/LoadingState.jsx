import React from "react";
import itestifyLogo from "../assets/images/loadinganimation.png";

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
        <div className="relative z-10">
          <img
            className="w-24 animate-spin-slow"
            src={itestifyLogo}
            alt="Loading"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;