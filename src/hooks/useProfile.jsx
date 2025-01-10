import React, { useState } from "react";

const useProfile = ({ donationType }) => {
  const [isOpenOptions, setIsOpenOptions] = useState(null);
  const [isUserDetails, setIsUserDetails] = useState(false);
  const[profile, setProfile] = useState(false)
  const [eachUser, setEachUser] = useState(null);
  const openProfileModal = (id) => {
    const userProfileMatch = donationType.find((user) => user.id === id);
    setIsOpenOptions(false);
    if (userProfileMatch) {
      setEachUser(userProfileMatch);
      setIsUserDetails(true);
      console.log(userProfileMatch);
    } else {
      console.error("User not found");
    }
  };
  return {
    isOpenOptions,
    setIsOpenOptions,
    openProfileModal,
    eachUser,
    setEachUser,
    isUserDetails,
    setIsUserDetails,
    profile,
    setProfile
  };
};

export default useProfile;
