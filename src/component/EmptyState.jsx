import React from "react";
import nodata from "../assets/images/No-data.png";
const EmptyState = () => {
  return (
    <div className="grid place-items-center">
      <div className="w-full flex flex-col justify-between gap-16">
        <div className="flex justify-center items-center mt-6">
          <img src={nodata} alt="" width={100} height={100} />
        </div>

        <div className="flex justify-between items-center w-full p-5">
          <p>Showing 0 of 0</p>
          <div className="flex gap-2 items-center ">
            <button className="btn-secondary">Previous</button>
            <button className="btn-secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
