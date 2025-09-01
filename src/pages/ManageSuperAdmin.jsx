import {
  ArrowLeftOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import LoadingState from "../component/LoadingState";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../context/DarkModeContext";
import axios from "axios";
import { message } from "antd";
import { FaAngleDown } from "react-icons/fa6";

const ManageSuperAdmin = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const token = localStorage.getItem("token");
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://itestify-backend-38u1.onrender.com";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [tabState, setTabState] = useState("transferUser");

  const [selectUserDropdown, setSelectUserDropdown] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [members, setMembers] = useState([]);

  const [changeRoleInvite, setChangeRoleInvite] = useState(false);

  const [actionInviteOption, setActionInviteOption] = useState("");
  const [selectedInviteRoleId, setSelectedInviteRoleId] = useState(null);
  const [changeRoleInviteDropdwon, setChangeRoleInviteDropdown] =
    useState(false);

  // console.log(adminRoles)
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    role: "",
    email: "",
  });
  const [newSuperAdmin, setNewSuperAdmin] = useState({
    name: "",
    email: "",
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auths/roles/all/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMembers(response?.data?.data);
      console.log(response?.data?.data);
    } catch (error) {
      message.error(error?.message);
      console.log(error);
      console.error(
        "Error fetching members:",
        error?.response || error?.message
      );
    } finally {
      setLoading(false);
    }
  };
  const adminRoles = members.filter((role) => role.name !== "Super Admin");
  useEffect(() => {
    fetchMembers();
  }, [adminDetails]);

  const handleSelectAdd = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };
  const addSuperAdmin = async (e) => {
    try {
      e.preventDefault();
      const alternative_role = adminRoles.find(
        (role) => role.id === selectedInviteRoleId
      ).name;
      const payload = {
        full_name: newSuperAdmin.name,
        email: newSuperAdmin.email,
        role: "Super Admin",
        alternative_role: alternative_role,
      };
      if (
        !newSuperAdmin.name ||
        !newSuperAdmin.email ||
        !selectedInviteRoleId
      ) {
        message.error("Please fill in all the fields!");
        return;
      }
      await axios
        .post(`${API_URL}/auths/invite/add-member/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data)
        .then((response) => console.log(response));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen rounded-lg">
      <main className="w-full">
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
                className={` w-full text-center rounded-none border-b-2  ${
                  tabState === "transferUser"
                    ? `border-primary bg-transparent ${
                        isDarkMode ? `text-white` : `text-black`
                      }`
                    : `border-transparent  ${
                        isDarkMode ? `text-near-white` : `text-off-black`
                      }`
                }   cursor-pointer`}
                onClick={() => setTabState("transferUser")}
              >
                Transfer to Existing User
              </p>

              <p
                value="inviteUser"
                className={`w-full text-center rounded-none border-b-2  ${
                  tabState === "inviteUser"
                    ? `border-primary bg-transparent ${
                        isDarkMode ? `text-white` : `text-black`
                      }`
                    : `border-transparent ${
                        isDarkMode ? `text-near-white` : `text-off-black`
                      }`
                }   cursor-pointer`}
                onClick={() => setTabState("inviteUser")}
              >
                Invite New User
              </p>
            </div>
            <div className="p-3">
              {tabState === "transferUser" ? (
                <div>
                  <p>Select user to transfer super admin role to:</p>
                  <div
                    className="mb-6"
                    onClick={() => setSelectUserDropdown(true)}
                  >
                    <button className="w-full p-2 py-3 rounded-[8px] space-x-4 mt-3 border-[#9b9ea4] border-[1px] flex justify-between bg-transparent items-center">
                      <span>
                        {selectedUserIds.length === 0
                          ? "Select User"
                          : adminRoles
                              .flatMap((role) => role.members)
                              .find((user) => user.id === selectedUserIds[0])
                              ?.full_name || "Unknown user"}
                      </span>

                      <FaAngleDown className="w-3 h-3  mr-2" />
                    </button>
                  </div>
                  <p>After transfer, select what happens to your account</p>
                  <div className="flex w-full justify-normal lg:flex-row flex-col lg:items-center gap-4 mt-3">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="option"
                        value="change_role"
                        id="change-role"
                        onChange={(e) => {
                          setChangeRoleInvite(true);
                          setActionInviteOption(e.target.value);
                        }}
                      />
                      <label htmlFor="change-role">Change my role</label>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="option"
                        value="remove_access"
                        id="remove-access"
                        onChange={(e) => {
                          setChangeRoleInvite(false);
                          setActionInviteOption(e.target.value);
                        }}
                      />
                      <label htmlFor="remove-access">Delete my account</label>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectUserDropdown && (
                      <div className={`fixed inset-0 z-50`}>
                        {/* Non-clickable overlay */}
                        <div
                          className={`absolute inset-0 bg-black bg-opacity-50`}
                          aria-hidden="true"
                        />

                        {/* Modal */}
                        <div
                          className={` p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md shadow-2xl rounded-lg h-[600px] overflow-y-auto no-scrollbar  ${
                            isDarkMode ? `bg-grayBlack` : `bg-off-white`
                          }`}
                        >
                          <div className="flex justify-end items-end  mb-4 mt-5">
                            <MdClose
                              className="flex justify-end items-end cursor-pointer"
                              onClick={() => setSelectUserDropdown(false)}
                            />
                          </div>

                          <div className="">
                            <div className="flex justify-normal items-center relative">
                              <SearchOutlined className="w-5 absolute left-3" />
                              <input
                                type="search"
                                className={`${
                                  isDarkMode ? `bg-off-black` : `bg-near-white`
                                } w-full rounded-lg p-1 pl-10 placeholder:text-xs`}
                                placeholder="Search Users"
                                // value={searchQuery}
                                // onChange={handleSearch}
                              />
                            </div>

                            <div className="space-y-4">
                              {adminRoles?.map((role) =>
                                role?.members?.flatMap?.((member) => (
                                  <div
                                    key={`${role.id}-${member.id}`}
                                    className="flex justify-between w-full lg:items-center items-start py-4 border-b"
                                  >
                                    <div className="flex justify-normal items-center gap-10">
                                      <input
                                        type="checkbox"
                                        name={`add-${member.id}`}
                                        checked={selectedUserIds.includes(
                                          member.id
                                        )}
                                        onChange={() =>
                                          handleSelectAdd(member.id)
                                        }
                                      />
                                      <div
                                        className={
                                          isDarkMode
                                            ? "text-off-white"
                                            : "text-black"
                                        }
                                      >
                                        <p>
                                          {member.full_name || "Unknown user"}
                                        </p>
                                        <p>{member?.email}</p>
                                      </div>
                                    </div>

                                    <p className="text-nowrap lg:text-base text-xs">
                                      {role.name}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* </div> */}
                    {changeRoleInvite && (
                      <div>
                        <button
                          className="w-full p-2 py-3 rounded-[8px] space-x-4 mt-3 border-[#9b9ea4] border-[1px] flex justify-between bg-transparent items-center"
                          onClick={() =>
                            setChangeRoleInviteDropdown(
                              !changeRoleInviteDropdwon
                            )
                          }
                        >
                          <span>
                            {selectedInviteRoleId
                              ? adminRoles.find(
                                  (role) => role.id === selectedInviteRoleId
                                )?.name
                              : "Select Role"}
                          </span>
                          <FaAngleDown className="w-3 h-3  mr-2" />
                        </button>
                        <div className=" border-y-borderColor border-[1px]">
                          {changeRoleInviteDropdwon &&
                            adminRoles.map((role, index) => (
                              <div
                                key={index}
                                className="w-full text-center px-4 py-2 cursor-pointer border-b border-b-borderColor hover:bg-off-black"
                                onClick={() => {
                                  setSelectedInviteRoleId(role.id);
                                  setChangeRoleInviteDropdown(false);
                                }}
                              >
                                {role.name}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    <button
                      //  onClick={() => setShowConfirmModal(true)}
                      className="btn-primary bg-primary hover:bg-purple-800 cursor-pointer mt-24 w-full text-center p-2"
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              ) : (
                // SECOND TAB TO ADD NEW SUPER ADMIN INFORMATION
                <form onSubmit={addSuperAdmin}>
                  <div>
                    <p className="font-bold">Add New Super Admin Information</p>
                    <div className="flex justify-between items-center py-3 w-full">
                      <div className="flex flex-col gap-2 w-full">
                        <p className="font-semibold">Name</p>
                        <input
                          type="text"
                          value={newSuperAdmin.name}
                          onChange={(e) =>
                            setNewSuperAdmin({
                              ...newSuperAdmin,
                              name: e.target.value,
                            })
                          }
                          name="name"
                          className={`rounded-md p-2 w-full ${
                            isDarkMode ? `bg-off-black` : `bg-off-white`
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 w-full">
                      <div className="flex flex-col gap-2 w-full">
                        <p className="font-semibold">Email Address</p>
                        <input
                          type="email"
                          value={newSuperAdmin.email}
                          name="email"
                          onChange={(e) =>
                            setNewSuperAdmin({
                              ...newSuperAdmin,
                              email: e.target.value,
                            })
                          }
                          className={`rounded-md p-2 w-full ${
                            isDarkMode ? `bg-off-black` : `bg-off-white`
                          }`}
                        />
                      </div>
                    </div>
                    <div className="">
                      <p>After transfer, select what happens to your account</p>
                      <div className="flex w-full justify-normal lg:flex-row flex-col lg:items-center gap-4 mt-3">
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="transfer"
                            id=""
                            value="change_role"
                            onChange={(e) => {
                              setChangeRoleInvite(true);
                              setActionInviteOption(e.target.value);
                            }}
                          />
                          <label htmlFor="change-role">Change my role</label>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="transfer"
                            id=""
                            value="remove_access"
                            onChange={(e) => {
                              setChangeRoleInvite(false);
                              setActionInviteOption(e.target.value);
                            }}
                          />
                          <label htmlFor="remove-access">
                            Delete my account
                          </label>
                        </div>
                      </div>

                      {changeRoleInvite && (
                        <div>
                          <button
                            type="button"
                            className="w-full p-2 py-3 rounded-[8px] space-x-4 mt-3 border-[#9b9ea4] border-[1px] flex justify-between bg-transparent items-center"
                            onClick={() =>
                              setChangeRoleInviteDropdown(
                                !changeRoleInviteDropdwon
                              )
                            }
                          >
                            <span>
                              {selectedInviteRoleId
                                ? adminRoles.find(
                                    (role) => role.id === selectedInviteRoleId
                                  )?.name
                                : "Select Role"}
                            </span>
                            <FaAngleDown className="w-3 h-3  mr-2" />
                          </button>
                          <div className=" border-y-borderColor border-[1px]">
                            {changeRoleInviteDropdwon &&
                              adminRoles.map((role, index) => (
                                <div
                                  key={index}
                                  className="w-full text-center px-4 py-2 cursor-pointer border-b border-b-borderColor hover:bg-off-black"
                                  onClick={() => {
                                    setSelectedInviteRoleId(role.id);
                                    setChangeRoleInviteDropdown(false);
                                  }}
                                >
                                  {role.name}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      disabled={
                        // isLoadInvite ||
                        !selectedInviteRoleId ||
                        !newSuperAdmin.email ||
                        !newSuperAdmin.name ||
                        !actionInviteOption
                        // (changeRoleInvite && !selectedInviteRoleId)
                      }
                      type="submit"
                      className=" btn-primary
                                 bg-primary hover:bg-purple-800 cursor-pointer p-2 mt-24 w-full text-center disabled:bg-gray-500 disabled:cursor-auto disabled:border-0"
                    >
                      Send invitation
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageSuperAdmin;
