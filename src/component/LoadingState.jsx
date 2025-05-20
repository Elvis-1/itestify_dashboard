import React from "react";
import itestifyLogo from "../assets/images/loadinganimation.png";
const LoadingState = () => {
  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md">
        <img className="w-24" src={itestifyLogo} alt="" />
      </div>
    </div>
  );
};

export default LoadingState;
