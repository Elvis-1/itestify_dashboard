import React, { useState, useContext, useMemo } from "react";
import { LuChevronsUpDown } from "react-icons/lu";
import { UsersDonations } from "../../data/donations";
import { SearchOutlined } from "@ant-design/icons";
import { RiFilter3Line } from "react-icons/ri";
import { DarkModeContext } from "../../context/DarkModeContext";
import Pagination from "../Pagination";
import usePagination from "../../hooks/usePagination";
import useSort from "../../hooks/useSort";
import FilterDonations from "../Popups/FilterDonations";
import { DonationsContext } from "../../context/DonationContext";
import NoDataComponent from "../NoDataComponent";

const AllDonations = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { userDonation } = useContext(DonationsContext);
  const [userDonations, setUserDonations] = useState(userDonation);
  const [searchItem, setSearchItem] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [filters, setFilters] = useState({
    selectedOption: null,
    selectedCurrency: "",
    amountRange: { min: "", max: "" },
    dateRange: { from: "", to: "" },
  });
  const showFilterModal = () => {
    setIsFilter(!isFilter);
  };

  const allDonations = useMemo(() => {
    return userDonations.filter(
      (item) =>
        searchItem === "" ||
        item.email?.toLowerCase().includes(searchItem.toLowerCase())
    );
  }, [searchItem, userDonations]);
  const { sort, sortHeader, sortedData } = useSort(userDonations);
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
      key: "status",
      Label: "Status",
    },
  ];

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchItem(searchValue);
  };

  return (
    <div className={`relative `}>
      {isFilter && (
        <FilterDonations
          setIsFilter={setIsFilter}
          filters={filters}
          setFilters={setFilters}
          setUserDonation={setUserDonations}
        />
      )}
      <div className={` rounded-t-2xl h-[24rem]`}>
        <div className={`flex justify-between items-center w-full pb-2 px-3 `}>
          <h3 className="py-5 ">Donations</h3>
          <div className="flex items-center gap-4">
            {/*---------------------------------------- Search Bar  ---------------------------------*/}
            <div
              className={`flex justify-left items-center gap-2 p-3 rounded-lg w-[300px] ${
                isDarkMode ? `bg-off-black` : `bg-off-white`
              } ]
            `}
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
            <div
              onClick={showFilterModal}
              className="flex justify-center items-center gap-1 p-2 rounded-md border-2 border-primary cursor-pointer "
            >
              <i>
                <RiFilter3Line fill="#9966cc" />
              </i>
              <p className=" text-primary text-sm">Filter</p>
            </div>
          </div>
        </div>
        <table
          className={`custom-table  font-sans text-[14px] ${
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
                  className={`cursor-pointer text-xs ${
                    isDarkMode
                      ? `bg-off-black text-white`
                      : `bg-off-white text-black`
                  }`}
                  onClick={() => {
                    sortHeader({ key: header.key }), console.log(header.key);
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
          {allDonations.length > 0 ? (
            users.map((data) => (
              <tbody className="relative text-xs" key={data.id}>
                <tr
                  className={` ${
                    isDarkMode
                      ? `hover:bg-off-black`
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
                    <button
                      className={`border-2 py-2 px-3 rounded-2xl w-20 ${
                        data.status === "Pending"
                          ? `border-yellow-500 text-yellow-500 `
                          : data.status === "Verified"
                          ? `border-green-500 text-green-500 `
                          : `border-red text-red `
                      }`}
                    >
                      {data.status}
                    </button>
                  </td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr className="border-b-0">
                <td colSpan={8} className="hover:bg-lightBlack border-b-0">
                  <NoDataComponent />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {/* <-------------------------------------Pagination-------------------------------------> */}
      <Pagination
        data={allDonations}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        firstIndex={firstIndex}
        lastIndex={lastIndex}
        npage={npage}
      />
    </div>
  );
};
export default AllDonations;
