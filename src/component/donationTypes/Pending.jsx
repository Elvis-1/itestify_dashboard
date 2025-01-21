import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import { UsersDonations } from "../../data/donations";
import { DarkModeContext } from "../../context/DarkModeContext";
import { LuChevronsUpDown } from "react-icons/lu";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import useSort from "../../hooks/useSort";
import Pagination from "../Pagination";
import usePagination from "../../hooks/usePagination";
import DonationsDetails from "../Popups/DonationsDetails";
import { VerifyDonations } from "../Popups/VerifyDonations";
import useProfile from "../../hooks/useProfile";
import FailedDonation from "../Popups/FailedDonation";
import useVerifiedandFailed from "../../hooks/useVerifiedandFailed";
import SuccessModal from "../Popups/SuccessModal";
import { DonationsContext } from "../../context/donationContext";

const Pending = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { userDonation, setUserDonation } = useContext(DonationsContext);
  const [searchItem, setSearchItem] = useState("");
  const [reason, setReason] = useState("");
  const [currentDonation, setCurrentDonation] = useState(null);
  const dropdownRef = useRef(null);

  const toggleOptions = (index) => {
    setIsOpenOptions( index);
  };
  const pendingDonations = userDonation.filter(
    (item) => item.status === "Pending"
  );
  const filteredDonations = useMemo(() => {
    return pendingDonations.filter(
      (item) =>
        searchItem === "" ||
        item.email?.toLowerCase().includes(searchItem.toLowerCase())
    );
  }, [searchItem, pendingDonations]);
  const { currentPage, setCurrentPage, firstIndex, lastIndex, users, npage } =
    usePagination(filteredDonations);
  const { sort, sortHeader, sortArray } = useSort();
  const tableHeaders = [
    {
      key: "serialno",
      Label: "S/N",
    },
    {
      key: "paymentReceipt",
      Label: "Payment receipt",
    },
    {
      key: "verCode",
      Label: "Verification code",
    },
    {
      key: "email",
      Label: "Email",
    },
    {
      key: "date",
      Label: "Date",
    },
    {
      key: "amount",
      Label: "Amount",
    },
    {
      key: "currency",
      Label: "Currency",
    },
    {
      key: "actions",
      Label: "Action",
    },
  ];
  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  };
  const {
    openProfileModal,
    isUserDetails,
    setIsUserDetails,
    eachUser,
    isOpenOptions,
    setIsOpenOptions,
  } = useProfile({ donationType: pendingDonations });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const {
    isVerified,
    setIsVerified,
    openVerifyModal,
    isFailed,
    setIsFailed,
    openFailedModal,
    isSuccessModal,
    setIsSuccessModal,
    donaStatus,
  } = useVerifiedandFailed();
  
  useEffect(() => {
    if(isSuccessModal){
    const timeout = setTimeout(() => {
      setIsSuccessModal(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }
  }, [isSuccessModal]);

  const verifyDonation = (id) => {
    const updatedDonations = userDonation.map((donation) =>
      donation.id === id ? { ...donation, status: "Verified" } : donation
    );
    setUserDonation(updatedDonations);
    console.log(updatedDonations);
  };

  const markAsFailed = (id) => {
    const updatedDonations = userDonation.map((donation) =>
      donation.id === id
        ? { ...donation, status: "Failed", reason: reason }
        : donation
    );
    setUserDonation(updatedDonations);
    console.log(updatedDonations);
  };
  return (
    <div className={`relative `}>
      {isUserDetails && (
        <DonationsDetails
          setIsUserDetails={setIsUserDetails}
          DonationUser={eachUser}
        />
      )}
      {isVerified && (
        <VerifyDonations
          setIsVerified={setIsVerified}
          setIsSuccessModal={setIsSuccessModal}
          filteredDonations={filteredDonations}
          verifyDonation={() => {
            verifyDonation(currentDonation);
          }}
        />
      )}
      {isFailed && (
        <FailedDonation
          setIsFailed={setIsFailed}
          setIsSuccessModal={setIsSuccessModal}
          reason={reason}
          setReason={setReason}
          markAsFailed={() => {
            markAsFailed(currentDonation, reason);
          }}
        />
      )}
      {isSuccessModal && (
        <SuccessModal
          sucessMessage={
            donaStatus === "Failed"
              ? "Donation Marked as Failed!"
              : "Donation Verified Successfully!"
          }
        />
      )}

      <div
        className={` rounded-t-2xl h-[26rem]`}
      >
        <div className={`flex justify-between items-center w-full pb-3 px-3`}>
          <h3 className="py-5">Donations</h3>

          <div
            className={`flex justify-left items-center gap-2 p-3 rounded-lg w-[300px] ${
              isDarkMode ? `bg-off-black` : `bg-off-white`
            }`}
          >
            <SearchOutlined
              style={{
                fill: isDarkMode ? "black" : "white",
                fontSize: "16px",
              }}
            />
            <input
              className="border-none outline-none bg-transparent w-[200px] text-xs placeholder:text-xs"
              type="text"
              name="search"
              id="search-user"
              placeholder="Search by Email"
              value={searchItem}
              onChange={handleSearch}
            />
          </div>
        </div>
        <table
          className={`custom-table font-sans text-[14px] ${
            isDarkMode ? `dark-mode` : `light-mode`
          } `}
        >
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  className={`cursor-pointer border-b-2 text-[10px] ${
                    isDarkMode
                      ? ` border-b-[#333333]  bg-off-black  `
                      : ` border-b-off-white`
                  }`}
                  onClick={() => {
                    sortHeader(header), console.log(header);
                  }}
                  key={index}
                >
                  <div className="flex items-center gap-1">
                    {header.Label}
                    <i>
                      <LuChevronsUpDown
                        direction={
                          sort.keyToSort === header.key
                            ? sort.direction
                            : "ascending"
                        }
                      />
                    </i>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {sortArray(users).map((data) => (
            <tbody className="relative text-xs" key={data.id}>
              <tr
                className={`relative ${
                  isDarkMode
                    ? `hover:bg-[#313131]`
                    : `hover:bg-off-white text-black`
                }`}
              >
                <td>{data.id}</td>
                <td>
                  <img
                    className="w-10 h-8"
                    src={data.image}
                    alt="donation-receipt"
                  />
                </td>
                <td>{data.verificationCode}</td>
                <td>{data.email}</td>
                <td>{data.date}</td>
                <td>{data.amount}</td>
                <td>{data.currency}</td>
                <td>
                  {isOpenOptions === data.id && (
                    <div
                      ref={dropdownRef}
                      className={`rounded-lg ${
                        isDarkMode
                          ? `text-white bg-[#292929]`
                          : `text-black bg-white`
                      } w-[120px] border-[1px] border-white absolute top-10 right-10 z-50 shadow-lg`}
                    >
                      <p
                        onClick={() => {
                          setCurrentDonation(data.id);
                          openVerifyModal(data.id);
                          setIsOpenOptions(null);
                        }}
                        className="border-b-[1px] border-gray-300 p-2 cursor-pointer"
                      >
                        Verify
                      </p>
                      <p
                        onClick={() => {
                          openProfileModal(data.id);
                          setIsOpenOptions(null);
                        }}
                        className="border-b-[1px] border-gray-300 p-2 cursor-pointer "
                      >
                        View Details
                      </p>
                      <p
                        onClick={() => {
                          openFailedModal(data.id);
                          setCurrentDonation(data.id);
                          setIsOpenOptions(null);
                        }}
                        className="p-2 text-[#E53935] cursor-pointer"
                      >
                        Mark as failed
                      </p>
                    </div>
                  )}
                  <i
                    onClick={() => {
                      toggleOptions(data.id);
                    }}
                  >
                    <MdOutlineMoreHoriz />
                  </i>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      <Pagination
        data={filteredDonations}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        firstIndex={firstIndex}
        lastIndex={lastIndex}
        npage={npage}
      />
    </div>
  );
};

export default Pending;
