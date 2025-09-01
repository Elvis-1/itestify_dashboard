import {
  ArrowLeftOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import LoadingState from "../component/LoadingState";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../context/DarkModeContext";
import { message } from "antd";
import axios from "axios";

const ManageUser = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://itestify-backend-38u1.onrender.com";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tabState, setTabState] = useState("addNewUser");
  const [selectUserDropdown, setSelectUserDropdown] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedUserIdRemove, setSelectedUserIdRemove] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auths/roles/all/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMembers(response?.data?.data || []);
    } catch (error) {
      message.error(error?.message || "Failed to fetch roles");
      console.error(
        "Error fetching members:",
        error?.response || error?.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Roles excluding the current role and "Super Admin" for "Add New User" tab
  const adminRoles = members.filter(
    (role) => role.id !== id && role.name !== "Super Admin"
  );
  // Users in the current role for "Remove Existing User" tab
  const existingUsers = members.filter((role) => role.id === id);

  // Filter members based on search query for "Add New User" tab
  const filteredAdminRoles = adminRoles.map((role) => ({
    ...role,
    members: role.members.filter(
      (member) =>
        member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSelectAdd = (userId) => {
    setSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectRemove = (userId) => {
    setSelectedUserIdRemove((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const assignUserToRole = async (roleId, emails) => {
    try {
      await axios.post(
        `${API_URL}/auths/roles/${roleId}/add-users`, // Adjust endpoint as per your API
        { emails }, // Adjust payload as per your API
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Users added successfully");
    } catch (error) {
      throw error; // Let the caller handle the error
    }
  };

  const removeUsersFromRole = async (roleId, userIds) => {
    try {
      await axios.post(
        `${API_URL}/auths/roles/${roleId}/remove-users`, // Adjust endpoint as per your API
        { userIds }, // Adjust payload as per your API
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Users removed successfully");
    } catch (error) {
      throw error; // Let the caller handle the error
    }
  };

  const assignUserFromOtherRole = async () => {
    // Collect emails from selected users across all adminRoles
    const emailsToAdd = adminRoles
      .flatMap((role) => role.members)
      .filter((user) => selectedUserIds.includes(user.id))
      .map((user) => user.email.trim());

    if (emailsToAdd.length === 0) {
      message.warning("No users selected to add.");
      return;
    }

    try {
      console.log(emailsToAdd);
      setLoading(true);
      await assignUserToRole(id, emailsToAdd);
      setSelectedUserIds([]);
      await fetchMembers();
      setSelectUserDropdown(false);
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to add users.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeExistingUsers = async () => {
    if (selectedUserIdRemove.length === 0) {
      message.warning("No users selected to remove.");
      return;
    }

    try {
      setLoading(true);
      await removeUsersFromRole(id, selectedUserIdRemove);
      setSelectedUserIdRemove([]);
      await fetchMembers();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to remove users."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen rounded-lg">
      <main className="w-full">
        {loading && <LoadingState />}
        <div className="rounded-lg bg-card md:px-5 px-0 pt-5">
          <div className="flex items-center justify-normal mb-5">
            <ArrowLeftOutlined
              src="/assets/icons/arrow-back.svg"
              width={20}
              height={20}
              className="font-bold cursor-pointer"
              onClick={() => navigate("/dashboard/general-settings")}
            />
            <h1 className="text-2xl font-bold text-center pl-12">
              Manage Role
            </h1>
          </div>
          <div
            className={`${
              isDarkMode ? `bg-[#1E1E1E]` : `bg-white`
            } p-3 rounded-xl`}
          >
            <div className="flex justify-between w-full border-b rounded-none bg-transparent px-36 pt-3 h-auto">
              <p
                className={`w-full text-center rounded-none border-b-2 ${
                  tabState === "addNewUser"
                    ? `border-primary bg-transparent text-white`
                    : `border-transparent text-near-white`
                } cursor-pointer`}
                onClick={() => setTabState("addNewUser")}
              >
                Add New User
              </p>
              <p
                value="removeExistingUser"
                className={`w-full text-center rounded-none border-b-2 ${
                  tabState === "removeUser"
                    ? `border-primary bg-transparent text-white`
                    : `border-transparent text-near-white`
                } cursor-pointer`}
                onClick={() => setTabState("removeUser")}
              >
                Remove Existing User
              </p>
            </div>
            <div className="p-3">
              {tabState === "addNewUser" ? (
                <div>
                  <p>Assign user from another role</p>
                  <div onClick={() => setSelectUserDropdown(true)}>
                    <button className="w-full p-2 py-3 rounded-[8px] space-x-4 mt-3 border-[#9b9ea4] border-[1px] flex justify-between bg-transparent">
                      <span>Select User</span>
                      <DownOutlined className="w-3 h-3 ml-auto mt-2 mr-2" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {selectUserDropdown && (
                      <div className="fixed inset-0 z-50">
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50"
                          aria-hidden="true"
                        />
                        <div
                          className={`p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg shadow-2xl ${
                            isDarkMode ? `bg-grayBlack` : `bg-off-white`
                          }`}
                        >
                          <div className="relative overflow-y-auto hide-scrollbar max-h-[500px] mt-5">
                            <div className="w-full flex justify-end bg-grayBlack sticky top-0 z-50">
                              <MdClose
                                className="cursor-pointer w-7 h-7"
                                onClick={() => setSelectUserDropdown(false)}
                              />
                            </div>
                            <div className="flex justify-normal items-center relative mt-12">
                              <SearchOutlined className="w-5 absolute left-3" />
                              <input
                                type="search"
                                className={`${
                                  isDarkMode ? `bg-off-black` : `bg-near-white`
                                } w-full rounded-lg p-1 pl-10 placeholder:text-xs`}
                                placeholder="Search Users"
                                value={searchQuery}
                                onChange={handleSearch}
                              />
                            </div>
                            <div className="space-y-4">
                              {filteredAdminRoles.length > 0 &&
                              filteredAdminRoles.some(
                                (role) => role.members.length > 0
                              ) ? (
                                filteredAdminRoles.map((role) =>
                                  role.members.map((member) => (
                                    <div
                                      key={member.id}
                                      className="flex justify-between w-full lg:items-center items-start py-2 border-b"
                                    >
                                      <div className="flex justify-normal items-center gap-10">
                                        <input
                                          type="checkbox"
                                          checked={selectedUserIds.includes(
                                            member.id
                                          )}
                                          onChange={() =>
                                            handleSelectAdd(member.id)
                                          }
                                          name={`add-${member.id}`}
                                          id={`add-${member.id}`}
                                        />
                                        <div>
                                          <p>
                                            {member.full_name || "Unknown user"}
                                          </p>
                                          <p className="text-muted-foreground">
                                            {member.email}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-nowrap lg:text-base text-xs">
                                        {role.name}
                                      </p>
                                    </div>
                                  ))
                                )
                              ) : (
                                <p>No users available to add.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={assignUserFromOtherRole}
                      className="bg-primary hover:bg-purple-800 cursor-pointer mt-24 w-full text-center p-2"
                      disabled={selectedUserIds.length === 0}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-bold">Select Users to remove</p>
                  {existingUsers.length > 0 &&
                  existingUsers.some((role) => role.members.length > 0) ? (
                    existingUsers.map((role) =>
                      role.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex justify-between items-center py-3 w-full"
                        >
                          <div>
                            <p>{member.full_name || "Unknown user"}</p>
                            <p>{member.email}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedUserIdRemove.includes(member.id)}
                            onChange={() => handleSelectRemove(member.id)}
                            name={`remove-${member.id}`}
                            id={`remove-${member.id}`}
                          />
                        </div>
                      ))
                    )
                  ) : (
                    <p>No users available to remove.</p>
                  )}
                  <button
                    onClick={removeExistingUsers}
                    className="bg-[#D72638] hover:bg-red-800 cursor-pointer mt-24 w-full text-center p-2"
                    disabled={selectedUserIdRemove.length === 0}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageUser;
