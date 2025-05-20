import React, {createContext, useState } from "react";
import { UsersDonations } from "../data/donations";
export const DonationsContext = createContext();
const DonationContext = ({ children }) => {
  const [userDonation, setUserDonation] = useState(UsersDonations);
  return (
    <DonationsContext.Provider value={{ userDonation, setUserDonation }}>
      {children}
    </DonationsContext.Provider>
  );
};

export default DonationContext;
