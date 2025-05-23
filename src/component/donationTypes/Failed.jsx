import React, { useContext, useState, useMemo, useEffect, useRef } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { LuChevronsUpDown } from "react-icons/lu";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import useSort from "../../hooks/useSort";
import Pagination from "../Pagination";
import DonationsDetails from "../Popups/DonationsDetails";
import usePagination from "../../hooks/usePagination";
import useProfile from "../../hooks/useProfile";
import { DonationsContext } from "../../context/DonationContext";
import NoDataComponent from "../NoDataComponent";

const Failed = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { userDonation, setUserDonation } = useContext(DonationsContext);
  const [searchItem, setSearchItem] = useState("");
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? null : index);
  };
  const failedDonations = userDonation.filter(
    (item) => item.status === "Failed"
  );
  const filteredDonations = useMemo(() => {
    return failedDonations.filter(
      (item) =>
        searchItem === "" ||
        item.email?.toLowerCase().includes(searchItem.toLowerCase())
    );
  }, [searchItem]);

  //Profile custom hooks
  const {
    openProfileModal,
    isUserDetails,
    setIsUserDetails,
    eachUser,
    isOpenOptions,
    setIsOpenOptions,
  } = useProfile({ donationType: filteredDonations });
  const { sort, sortHeader, sortedData } = useSort(filteredDonations);
  const { currentPage, setCurrentPage, firstIndex, lastIndex, users, npage } =
    usePagination(sortedData);
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
      key: "reason",
      Label: "Reason",
    },
    {
      key: "actions",
      Label: "Action",
    },
  ];

  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  };
  //Close droopdown
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative`}>
      {isUserDetails && (
        <DonationsDetails
          setIsUserDetails={setIsUserDetails}
          DonationUser={eachUser}
        />
      )}
      <div className={` rounded-t-2xl h-[25rem]`}>
        <div className={`flex justify-between items-center w-full pb-2 px-3`}>
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
            isDarkMode ? `bg-lightBlack dark-mode` : `light-mode`
          } `}
        >
          <thead
            className={` text-xs ${
              isDarkMode ? `bg-near-black` : `bg-off-white text-black`
            }`}
          >
            <tr
              className={` ${
                isDarkMode
                  ? `bg-off-black text-white hover:bg-[#313131]`
                  : `bg-white text-black hover:bg-off-white`
              }`}
            >
              {tableHeaders.map((header, index) => (
                <th
                  className={`cursor-pointer text-[10px] ${
                    isDarkMode
                      ? `bg-off-black text-white`
                      : `bg-off-white text-black`
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
          {filteredDonations.length > 0 ? (
            users.map((data) => (
              <tbody className="relative text-xs" key={data.id}>
                <tr
                  className={` ${
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
                  <td className={`${!data.reason ? `text-center` : ``}`}>
                    {data.reason ? data.reason : `Nil`}
                  </td>
                  <td>
                    {isOpenOptions === data.id && (
                      <div
                        className={`rounded-lg ${
                          isDarkMode
                            ? `text-white bg-[#292929] border-white`
                            : `text-black bg-white border-borderColor`
                        } w-[120px] border-[1px]  absolute top-10 right-10 z-30 shadow-lg`}
                      >
                        <p
                          onClick={() => {
                            openProfileModal(data.id);
                          }}
                          className="
                         border-gray-300 p-2"
                        >
                          View details
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
            ))
          ) : (
            <tbody className="border-b-0 border-b-transparent">
              <tr className="border-b-0 border-b-transparent">
                <td
                  colSpan={9}
                  className="hover:bg-transparent border-b-0 border-b-transparent"
                >
                  <NoDataComponent />
                </td>
              </tr>
            </tbody>
          )}
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

export default Failed;
