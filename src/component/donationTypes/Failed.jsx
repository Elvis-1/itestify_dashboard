import React, { useContext, useState,useMemo } from "react";
import { UsersDonations } from "../../data/donations";
import { DarkModeContext } from "../../context/DarkModeContext";
import { LuChevronsUpDown } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { SearchOutlined } from "@ant-design/icons";
import { RiFilter3Line } from "react-icons/ri";
import useSort from "../../context/useSort";
import Pagination from "../Pagination";
import usePagination from "../../context/usePagination";
const Failed = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [searchItem, setSearchItem] = useState("");
  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? -1 : index);
  };
  const failedDonations = UsersDonations.filter(
    (item) => item.status === "Failed"
  );
  const filteredDonations = useMemo(() => {
    return failedDonations.filter(
      (item) =>
        searchItem === "" ||
        item.email?.toLowerCase().includes(searchItem.toLowerCase())
    );
  }, [searchItem]);
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

  return (
    <div className={`p-4 ${
      isDarkMode ? `bg-near-black` : `bg-off-white`
    } rounded-lg relative`}>
      <div className={`flex justify-between items-center w-full pb-3`}>
        <h3 className="py-5">Donations</h3>
        <div className="flex items-center gap-4">
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
          <div className="flex justify-center items-center gap-1 p-2 rounded-md border-2 border-primary cursor-pointer">
            <i>
              <RiFilter3Line fill="#9966cc" />
            </i>
            <p className="text-primary text-sm">Filter</p>
          </div>
        </div>
      </div>
      <div className={`table-container ${
          isDarkMode ? `bg-black` : `bg-white `
        }`}>
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
              <td>Reason for Failed</td>
              <td>
              {isOpenOptions === data.id && (
                        <div className={`rounded-lg ${isDarkMode? `text-white bg-[#292929]`: `text-black bg-white`} w-[120px] border-[1px] border-white absolute top-10 right-10 z-20 shadow-lg`}>
                          <p
                            onClick={() => {
                              openProfileModal(data.id);
                            }}
                            className="border-b-[1px] border-gray-300 p-2"
                          >
                            View details
                          </p>
                        </div>
                      )}
                <i onClick={()=>{toggleOptions(data.id)}}>
                  <BsThreeDotsVertical />
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

export default Failed;
