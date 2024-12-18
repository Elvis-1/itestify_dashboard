import React, { useState, useContext } from "react";
import { LuChevronsUpDown } from "react-icons/lu";
import { UsersDonations } from "../../data/donations";
import { DarkModeContext } from "../../context/DarkModeContext";

const AllDonations = ({donateUserType}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [userDonation, setUserDonation] = useState(UsersDonations);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const users = userDonation.slice(firstIndex, lastIndex);
  const npage = Math.ceil(UsersDonations.length / usersPerPage);

  const [searchItem, setSearchItem] = useState("");
  const [sort, setSort] = useState({
    keyToSort: "serialno",
    direction: "descending",
  });

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

  //<---------------Pagination Function------------------->
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const sortHeader = (header) => {
    setSort({
      keyToSort: header.key,
      direction:
        header.key === sort.keyToSort
          ? sort.direction === "ascending"
            ? "descending"
            : "ascending"
          : "descending",
    });
  };
  const sortArray = (array) => {
    if (sort.direction === "ascending") {
      return array.sort((a, b) =>
        a[sort.keyToSort] > b[sort.keyToSort] ? 1 : -1
      );
    }
    return array.sort((a, b) =>
      a[sort.keyToSort] > b[sort.keyToSort] ? -1 : 1
    );
  };
  return (
    <div>
      
      <div className=" bg-near-black rounded-lg">

        <div className='table-container'>
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
            {sortArray(users)
              .filter((item) => {
                const searchTerm = searchItem.toLowerCase();
                return (
                  searchTerm === "" ||
                  item.email.toLowerCase().includes(searchTerm)
                );
              })
              .map((data) => (
                <tbody className="relative text-xs" key={data.id}>
                  <tr
                    className={` ${
                      isDarkMode
                        ? `hover:bg-[#313131]`
                        : `hover:bg-off-white text-black`
                    }`}
                  >
                    <td>{data.id}</td>
                    <td><img className="w-10 h-8" src={data.image} alt="donation-receipt" /></td>
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

      {/* ----------------------------------------PAgination-------------------------------------------- */}
      <div className="flex justify-between items-center w-full pt-24 pb-12 px-4">
        {userDonation.length === 0 ? (
          <p>Showing 0 of 0</p>
        ) : (
          <p>
            Showing {` ${firstIndex + 1} - ${lastIndex}`} of{" "}
            {userDonation.length}
          </p>
        )}
        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-2 border-2 border-[#575757] rounded-md hover:border-[#9966CC]"
            onClick={prevPage}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 border-2 border-[#9966CC] rounded-md text-[#9966CC]"
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default AllDonations
