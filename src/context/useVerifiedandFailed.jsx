import React, { useState } from "react";
import useProfile from "./useProfile";
import { UsersDonations } from "../data/donations";
const useVerifiedandFailed = () => {

  const [ donaStatus, setDonaStatus] = useState("Verify")
  const [isVerified, setIsVerified] = useState(false);
  const { setIsOpenOptions } = useProfile({donationType: null});
  const openVerifyModal = (id) => {
    setIsOpenOptions(false);
    setIsVerified(!isVerified);
    setDonaStatus("Verified")
  };
  const [isFailed, setIsFailed] = useState(false);
  const openFailedModal = (id) => {
    setIsOpenOptions(false);
    setIsFailed(!isFailed);
    setDonaStatus("Failed")
  };

   const [isSuccessModal, setIsSuccessModal] = useState(false);
   const[ isFailedModal, setISFailedModal] = useState(false);

  return {
    isVerified,
    setIsVerified,
    openVerifyModal,
    isFailed,
    setIsFailed,
    openFailedModal,
    isSuccessModal,
    setIsSuccessModal,
    setDonaStatus,
    donaStatus,
    isFailedModal,
    setISFailedModal
  };
};

export default useVerifiedandFailed;
