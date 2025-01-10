import React, { useContext, useState, useMemo } from "react";
import { UsersDonations } from "../../data/donations";
import { DarkModeContext } from "../../context/DarkModeContext";
import { LuChevronsUpDown } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { SearchOutlined } from "@ant-design/icons";
import useSort from "../../hooks/useSort";
import Pagination from "../Pagination";
import DonationsDetails from "../Popups/DonationsDetails";
import usePagination from "../../hooks/usePagination";
import useVerifiedandFailed from "../../hooks/useVerifiedandFailed";
import useProfile from "../../hooks/useProfile";
import FailedStatus from "../Popups/FailedStatus";
import SuccessModal from "../Popups/SuccessModal";

const Verified = () => {
  //Usestates
  const { isDarkMode } = useContext(DarkModeContext);
  const [searchItem, setSearchItem] = useState("");

  //filtered donations
  const filteredDonations = useMemo(() => {
    return UsersDonations.filter((item) => item.status === "Verified").filter(
      (item) =>
        searchItem === "" ||
        item.email?.toLowerCase().includes(searchItem.toLowerCase())
    );
  }, [searchItem]);
  //toogle dropdown options for the action
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? -1 : index);
  };
  //Search function
  const handleSearch = (e) => {
    setSearchItem(e.target.value);
    console.log(filteredDonations);
  };

  // <---------------------------------------Custom Hooks-------------------------------------->
  const { sort, sortHeader, sortArray } = useSort();
  const { isFailedModal, setISFailedModal, isSuccessModal, setIsSuccessModal } =
    useVerifiedandFailed();
  const { currentPage, setCurrentPage, firstIndex, lastIndex, users, npage } =
    usePagination(filteredDonations);
  const {
    openProfileModal,
    isUserDetails,
    setIsUserDetails,
    eachUser,
    isOpenOptions,
    setIsOpenOptions,
  } = useProfile({ donationType: filteredDonations });

  //Table headers data
  const tableHeaders = [
    { key: "serialno", Label: "S/N" },
    { key: "paymentReceipt", Label: "Payment receipt" },
    { key: "verCode", Label: "Verification code" },
    { key: "email", Label: "Email" },
    { key: "date", Label: "Date" },
    { key: "amount", Label: "Amount" },
    { key: "currency", Label: "Currency" },
    { key: "actions", Label: "Action" },
  ];

  // const [reasonInput, setReasonInput] = useState("");
  const openFailedModal=(id)=>{
    const userProfileMatch = filteredDonations.find((user) => user.id === id);
    setISFailedModal(true);
    setIsOpenOptions(null);

  }

  return (
    <div className={` rounded-lg relative`}>
      {isUserDetails && (
        <DonationsDetails
          setIsUserDetails={setIsUserDetails}
          DonationUser={eachUser}
        />
      )}
      {isFailedModal && (
        <FailedStatus
          setISFailedModal={setISFailedModal}
          setISSuccessModal={setIsSuccessModal}
        />
      )}
      {isSuccessModal && (
        <SuccessModal sucessMessage="Status Changed to “Mark as Failed”" />
      )}

      <div className={`table-container rounded-t-2xl h-[40rem] relative`}>
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
          }`}
        >
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  className={`cursor-pointer border-b-2 text-[10px] ${
                    isDarkMode
                      ? ` border-b-[#333333] bg-off-black`
                      : ` border-b-off-white`
                  }`}
                  onClick={() => sortHeader(header)}
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
          {filteredDonations.length === 0 ? (
            <div>
              {" "}
              <p className="text-center text-xl flex justify-center items-center">
                No verified donations found
              </p>
            </div>
          ) : (
            <tbody className="relative text-xs">
              {sortArray(users).map((data) => (
                <tr
                  key={data.id}
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
                        className={`rounded-lg ${
                          isDarkMode
                            ? `text-white bg-[#292929]`
                            : `text-black bg-white`
                        } w-[120px] border-[1px] border-white absolute top-10 right-10 z-20 shadow-lg`}
                      >
                        <p
                          onClick={() => {
                            openProfileModal(data.id);
                            setIsOpenOptions(null);
                          }}
                          className="border-b-[1px] border-gray-300 p-2"
                        >
                          View Details
                        </p>
                        <p
                          onClick={() => {
                            openFailedModal(data.id)
                          }}
                          className="p-2 text-[#E53935]"
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
                      <BsThreeDotsVertical />
                    </i>
                  </td>
                </tr>
              ))}
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

export default Verified;
