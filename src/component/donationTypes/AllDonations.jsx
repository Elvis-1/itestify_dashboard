import React, { useState, useContext, useMemo } from "react";
import { LuChevronsUpDown } from "react-icons/lu";
import { UsersDonations } from "../../data/donations";
import { SearchOutlined } from "@ant-design/icons";
import { RiFilter3Line } from "react-icons/ri";
import { DarkModeContext } from "../../context/DarkModeContext";
import Pagination from "../Pagination";
import usePagination from "../../context/usePagination";
import useSort from "../../context/useSort";

const AllDonations = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [userDonation, setUserDonation] = useState(UsersDonations);
  const [searchItem, setSearchItem] = useState("");
  const {
    currentPage,
    setCurrentPage,
    firstIndex,
    lastIndex,
    users: paginatedData,
    npage,
  } = usePagination(userDonation);
  const { sort, sortHeader, sortArray } = useSort();
  const sortedData = useMemo(
    () => sortArray(paginatedData),
    [paginatedData, sort]
  );

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
    const filteredItems = UsersDonations.filter((user) =>
      user.email?.toLowerCase().includes(searchValue.toLowerCase())
    );

    setUserDonation(filteredItems);
  };

  return (
    <div>
      <div className="p-4 bg-near-black rounded-lg">
        <div className={`flex justify-between items-center w-full  pb-3`}>
          <h3 className="py-5 ">Donations</h3>
          <div className="flex items-center gap-4">
            {/*---------------------------------------- Search Bar  ---------------------------------*/}
            <div
              className={`flex justify-left items-center gap-2  p-3 rounded-lg w-[300px] ${
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
            <div className="flex justify-center items-center gap-1 p-2 rounded-md border-2 border-primary cursor-pointer ">
              <i>
                <RiFilter3Line fill="#9966cc" />
              </i>
              <p className=" text-primary text-sm">Filter</p>
            </div>
          </div>
        </div>

        <div className="table-container">
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
                      sortHeader(header);
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
            {sortedData.map((data) => (
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
            ))}
          </table>
        </div>
      </div>
      <Pagination
        data={userDonation}
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
