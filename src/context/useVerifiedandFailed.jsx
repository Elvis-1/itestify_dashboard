import React, { useState } from "react";
import useProfile from "./useProfile";
const useVerifiedandFailed = () => {
  const [isVerified, setIsVerified] = useState(false);
  const { setIsOpenOptions } = useProfile({donationType: null});
  const openVerifyModal = (id) => {
    setIsOpenOptions(false);
    setIsVerified(!isVerified);
  };
  const [isFailed, setIsFailed] = useState(false);
  const openFailedModal = (id) => {
    setIsOpenOptions(false);
    setIsFailed(!isFailed);
  };

  return {
    isVerified,
    setIsVerified,
    openVerifyModal,
    isFailed,
    setIsFailed,
    openFailedModal,
  };
};

export default useVerifiedandFailed;
