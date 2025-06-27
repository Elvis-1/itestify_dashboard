import { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdOutlineMoreHoriz } from "react-icons/md";
import PropTypes from "prop-types";


import ReactivateModal from "../Popups/ReactivateModal";

const DeactivatedAccount = ({ onReactivate, onViewProfile }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [deactivatedUsers, setDeactivatedUsers] = useState([]);
  const [openOptionsIndex, setOpenOptionsIndex] = useState(null);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
 
  useEffect(() => {
    const data = localStorage.getItem("deactivatedUsers");
    if (data) {
      setDeactivatedUsers(JSON.parse(data));
    }
  }, []);

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
    localStorage.setItem(
      "deactivatedUsers",
      JSON.stringify(updatedDeactivatedUsers)
    );

    
    if (typeof onReactivate === "function") {
      onReactivate(selectedUser); 
    }

    setSelectedUser(null);
    setShowReactivateModal(false); 
  };

  const handleViewProfile = (userId) => {
    setOpenOptionsIndex(null);
    if (typeof onViewProfile === "function") {
      const user = deactivatedUsers.find((u) => u.id === userId);
      if (user) onViewProfile(user);
    }
  };

  return (
    <div className="relative p-4">
      <h3
        className={`py-5 text-lg font-semibold ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        Deactivated Accounts
      </h3>

      <div
        className={`h-[21rem] rounded-b-2xl overflow-hidden ${
          isDarkMode ? "bg-lightBlack" : "bg-white"
        }`}
      >
        <table
          className={`custom-table font-sans text-[14px] w-full ${
            isDarkMode ? "bg-lightBlack dark-mode" : "light-mode"
          }`}
        >
          <thead
            className={`text-xs ${
              isDarkMode ? "bg-near-black text-white" : "bg-off-white text-black"
            }`}
          >
            <tr
              className={`$$${
                isDarkMode
                  ? "bg-off-black text-white hover:bg-[#313131]"
                  : "bg-white text-black hover:bg-off-white"
              }`}
            >
              <th className="p-3 border-b border-gray-300 cursor-default">#</th>
              <th className="p-3 border-b border-gray-300 cursor-default">User ID</th>
              <th className="p-3 border-b border-gray-300 cursor-default">Name</th>
              <th className="p-3 border-b border-gray-300 cursor-default">Email</th>
              <th className="p-3 border-b border-gray-300 cursor-default">Registration Date</th>
              <th className="p-3 border-b border-gray-300 cursor-default">Action</th>
            </tr>
          </thead>
          <tbody>
            {deactivatedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-white text-[16px] italic"
                >
                  No data here yet
                </td>
              </tr>
            ) : (
              deactivatedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`$$${
                    isDarkMode ? "hover:bg-[#313131]" : "hover:bg-off-white"
                  }`}
                >
                  <td className="p-3 border-t border-b border-gray-300">{index + 1}</td>
                  <td className="p-3 border-t border-b border-gray-300">
                    {user.id?.slice(0, 6)}
                  </td>
                  <td className="p-3 border-t border-b border-gray-300">
                    {user.full_name || "Unknown"}
                  </td>
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
                          isDarkMode ? "bg-[#292929] text-white" : "bg-white text-black"
                        }`}
                      >
                        <p
                          className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-center"
                          onClick={() => handleViewProfile(user.id)}
                        >
                          View Profile
                        </p>
                        <p
                          className="p-2 cursor-pointer text-green-600 hover:bg-green-100 dark:hover:bg-green-700 text-center"
                          onClick={() => handleReactivate(user)}
                        >
                          Reactivate User
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    
      {showReactivateModal && selectedUser && (
        <ReactivateModal
          
          onClose={() => setShowReactivateModal(false)} 
          onSuccess={handleReactivationComplete}
        />
      )}

     
    </div>
  );
};

DeactivatedAccount.propTypes = {
  onReactivate: PropTypes.func,
  onViewProfile: PropTypes.func,
};

export default DeactivatedAccount;

