import { useContext, useEffect, useMemo, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import { LuChevronsUpDown } from "react-icons/lu";
import { IoMdCheckmark } from "react-icons/io";
import ReactivateModal from "../Popups/ReactivateModal";
import UserRegProfile from "../Popups/UserRegProfile";
import useSort from "../../hooks/useSort";
import usePagination from "../../hooks/usePagination";
import Pagination from "../Pagination";
import NoDataComponent from "../NoDataComponent";
import PropTypes from "prop-types";
import { Dialog, DialogContent } from "../ui/dialog";

const DeactivatedAccount = ({ onReactivate }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [deactivatedUsers, setDeactivatedUsers] = useState([]);
  const [openOptionsIndex, setOpenOptionsIndex] = useState(null);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const loadDeactivatedUsers = () => {
      const stored = JSON.parse(localStorage.getItem("deactivatedUsers")) || [];
      setDeactivatedUsers(stored);
    };

    loadDeactivatedUsers();

    const handleStorageChange = (event) => {
      if (event.key === "deactivatedUsers") {
        loadDeactivatedUsers();
      }
    };
 



    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
       const changeSuccess = () => {
    setOpen(!open);
  };

  const toggleOptions = (index) => {
    setOpenOptionsIndex(openOptionsIndex === index ? null : index);
  };

  const handleReactivate = (user) => {
    setSelectedUser(user);
    setShowReactivateModal(true);
    setOpenOptionsIndex(null);
  };

  const handleReactivationComplete = () => {
    const updatedDeactivatedUsers = deactivatedUsers.filter(
      (u) => u.id !== selectedUser.id
    );
    setDeactivatedUsers(updatedDeactivatedUsers);
    localStorage.setItem("deactivatedUsers", JSON.stringify(updatedDeactivatedUsers));

    if (typeof onReactivate === "function") {
      onReactivate(selectedUser); // Notify parent to add user back to registered list
    }

    setSelectedUser(null);
    setShowReactivateModal(false);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfile(true);
  };

  const filteredUsers = useMemo(() => {
    const searchTerm = searchItem.toLowerCase().trim();
    return deactivatedUsers.filter(
      (item) =>
        searchTerm === "" ||
        item.full_name?.toLowerCase().includes(searchTerm) ||
        item.email?.toLowerCase().includes(searchTerm) ||
        item.id?.toLowerCase().includes(searchTerm)
    );
  }, [searchItem, deactivatedUsers]);

  const { sort, sortHeader, sortedData } = useSort(filteredUsers);
  const { firstIndex, lastIndex, users, npage } = usePagination(sortedData, currentPage);

  return (
    <div className="relative">
      {showProfile && (
        <UserRegProfile
          registeredUsers={selectedUser}
          setProfile={setShowProfile}
        />
      )}
      <div
        className={`flex justify-between items-center w-full mt-5 px-4 rounded-t-2xl ${
          isDarkMode ? `bg-lightBlack dark-mode` : `bg-white`
        }`}
      >
        <h3 className="py-5 text-lg">Deactivated Accounts</h3>
        <div className="flex items-center gap-4">
          <div
            className={`flex justify-left items-center gap-2 p-3 rounded-lg w-[300px] ${
              isDarkMode ? `bg-off-black` : `bg-off-white`
            }`}
          >
            <SearchOutlined
              style={{ fill: isDarkMode ? "black" : "white", fontSize: "16px" }}
            />
            <input
              className="border-none outline-none bg-transparent w-[200px] text-xs placeholder:text-xs"
              type="text"
              name="search"
              id="search-user"
              placeholder="Search by name, email, userID"
              onChange={(e) => {
                setSearchItem(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div
        className={`h-[21rem] rounded-b-2xl overflow-hidden ${
          isDarkMode ? `bg-lightBlack` : `bg-white`
        }`}
      >
        <table
          className={`custom-table font-sans text-[14px] w-full ${
            isDarkMode ? `bg-lightBlack dark-mode` : `light-mode`
          }`}
        >
          <thead
            className={`text-xs ${
              isDarkMode ? "bg-near-black text-white" : "bg-off-white text-black"
            }`}
          >
            <tr>
              {[
                { key: "serialno", Label: "S/N" },
                { key: "id", Label: "User ID" },
                { key: "full_name", Label: "Name" },
                { key: "email", Label: "Email" },
                { key: "created_at", Label: "Registration Date" },
              ].map((header, index) => (
                <th
                  className="p-3 cursor-pointer"
                  key={index}
                  onClick={() => sortHeader(header)}
                >
                  <div className="flex items-center gap-1">
                    {header.Label}
                    <LuChevronsUpDown
                      direction={sort.keyToSort === header.key ? sort.direction : "ascending"}
                    />
                  </div>
                </th>
              ))}
              <th className="p-3 cursor-default">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-white text-[16px] italic">
                  <NoDataComponent />
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${isDarkMode ? "hover:bg-[#313131]" : "hover:bg-off-white"}`}
                >
                  <td className="p-3 border-t border-b border-gray-300">{firstIndex + index + 1}</td>
                  <td className="p-3 border-t border-b border-gray-300">{user.id?.slice(0, 6)}</td>
                  <td className="p-3 border-t border-b border-gray-300">{user.full_name || "Unknown"}</td>
                  <td className="p-3 border-t border-b border-gray-300">{user.email}</td>
                  <td className="p-3 border-t border-b border-gray-300">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 border-b border-gray-300 relative">
                    <MdOutlineMoreHoriz
                      className="cursor-pointer"
                      onClick={() => toggleOptions(index)}
                      size={20}
                    />
                    {openOptionsIndex === index && (
                      <div
                        className={`absolute top-8 right-0 z-20 w-40 rounded-lg shadow-lg ${
                          isDarkMode ? "bg-[#292929] text-white" : "border-[1px] border-white bg-white text-black"
                        }`}
                      >
                        <p
                          className="p-2 pl-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-start"
                          onClick={() => handleViewProfile(user)}
                        >
                          View Profile
                        </p>
                        <hr className="border-t border-gray-300" />
                        <p
                          className="p-2 pl-4 cursor-pointer text-white text-start"
                          onClick={() => handleReactivate(user)}
                        >
                          Reactivate 
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          data={filteredUsers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          firstIndex={firstIndex}
          lastIndex={lastIndex}
          npage={npage}
        />
      </div>

        <Dialog
              open={open}
              onOpenChange={() => changeSuccess()}
            >
              <DialogContent className="flex justify-center items-center rounded-xl border-none">
                <div className="h-[18rem] w-[20rem] bg-[#171717] flex justify-center items-center rounded-xl">
                  <div
                    className={`flex flex-col items-center justify-center text-center h-[90%] w-[90%] ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <div className="h-[90px] w-[90px] bg-[#9966CC] rounded-full flex justify-center items-center">
                      <IoMdCheckmark size={50} fill="white" />
                    </div>
                    <div className="text-[20px] font-semibold mt-6">
                      Account Reactivated Successfully!
                    </div>
                
                  
                  </div>
                </div>
              </DialogContent>
            </Dialog>

      {showReactivateModal && selectedUser && (
        <ReactivateModal
         onClose={() => {
          setShowReactivateModal(false)
         }}
          onSuccess={handleReactivationComplete}
        />
      )}
    </div>
  );
};

DeactivatedAccount.propTypes = {
  onReactivate: PropTypes.func,
};

export default DeactivatedAccount;
