import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiSettings5Line } from "react-icons/ri";
import { DarkModeContext } from "../context/DarkModeContext";
import { IoMdAdd } from "react-icons/io";
import AddMember from "../component/generalSettingsPopups/AddMember";
import ConfirmAddAdmin from "../component/generalSettingsPopups/ConfirmAddAdmin";
import SuccessModal from "../component/generalSettingsPopups/SuccessModal";
import DeleteSuperAdmin from "../component/generalSettingsPopups/DeleteSuperAdmin";
import ShortPopup from "../component/generalSettingsPopups/ShortPopup";
import { MdOutlineMoreHoriz } from "react-icons/md";
import DeleteMember from "../component/generalSettingsPopups/DeleteMember";
import ShortSuccessMessage from "../component/generalSettingsPopups/ShortSuccessMessage";
import axios from "axios";
import { message } from "antd";
import LoadingState from "../component/LoadingState";
import CreateRole from "../component/generalSettingsPopups/CreateRole";

const GeneralSettings = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://itestify-backend-38u1.onrender.com";
  const [loading, setLoading] = useState(true);

  const [memberModal, setMemberModal] = useState(false);
  const [confirmAddAdmin, setConfirmAddAdmin] = useState(false);

  const [successModal, setSuccessModal] = useState(false);
  const [successChangeModal, setSuccessChangeModal] = useState(false);
  const [successCreateRole, setSuccessCreateRole] = useState(false);

  const [deleteSuperAdminModal, setDeleteSuperAdminModal] = useState(false);
  const [deleteMemberModal, setDeleteMemberModal] = useState(false);

  const [transferConfirmModal, setTransferConfirmModal] = useState(false);

  const [newMember, setNewMember] = useState([]);
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [role, setRole] = useState({
    name: "",
    permissions: [],
  });

  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);

  const [isDeleted, setIsDeleted] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  // const toggleOptions = (index) => {
  //   setIsOpenOptions(isOpenOptions === index ? -1 : index);
  // };
  const openConfirmModal = () => {
    setMemberModal(false);
    setConfirmAddAdmin(true);
  };

  //FETCH ALL ADMINS MEMEBERS
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/auths/roles/all/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setNewMember(response?.data?.data);
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

    fetchMembers();
  }, []);

  //ADD NEW MEMEBERS AND UPDATE EXISTING MEMEBERS
  const addAdminMember = async () => {
    // e.preventDefault();

    if (!adminDetails.name || !adminDetails.email || !adminDetails.role) {
      message.error("Please fill in all the required fields.");
      return;
    }

    try {
      const payload = {
        email: adminDetails.email,
        full_name: adminDetails.name,
        role: adminDetails.role,
      };

      if (isEditing) {
        if (!editMemberId) {
          message.error("No member selected for editing.");
          return;
        }

        const response = await axios.patch(
          `${API_URL}/auths/members/${editMemberId}/update-member/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setNewMember((prev) =>
          prev.map((member) =>
            member.id === editMemberId
              ? { ...member, ...response.data }
              : member
          )
        );
        setSuccessChangeModal(true);
      } else {
        const response = await axios.post(
          `${API_URL}/auths/invite/add-member/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setNewMember((prev) => [...prev, response.data]);
        setSuccessModal(true);
      }

      setConfirmAddAdmin(false);
      setAdminDetails({ name: "", email: "", role: "" });
      setMemberModal(false);
    } catch (error) {
      console.error("Failed to add member:", error);
      message.error(
        `${
          error?.response?.data?.message ||
          `Failed to add member:  ${error?.message}`
        }
         `
      );
    }
  };
  useEffect(() => {
    if (successModal) {
      setTimeout(() => {
        setSuccessModal(false);
      }, 2000);
    }
    if (transferConfirmModal) {
      setTimeout(() => {
        setTransferConfirmModal(false);
      }, 2000);
    }
    if (successChangeModal) {
      setTimeout(() => {
        setSuccessChangeModal(false);
      }, 2000);
    }
    if (isDeleted) {
      setTimeout(() => {
        setIsDeleted(false);
      }, 2000);
    }
    if (successCreateRole) {
      setTimeout(() => {
        setSuccessCreateRole(false);
      }, 2000);
    }
  }, [
    successModal,
    transferConfirmModal,
    successChangeModal,
    isDeleted,
    successCreateRole,
  ]);

  //DELETE ADMIN MEMBERS
  const confirmDeleteMember = async () => {
    try {
      await axios.delete(
        `${API_URL}/auths/members/${memberToDelete}/delete-member/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNewMember((prev) =>
        prev.filter((member) => member.id !== memberToDelete)
      );
      setDeleteMemberModal(false);
      setIsDeleted(true);
      setMemberToDelete(null);
    } catch (error) {
      message.error("Failed to delete member.");
    }
  };
  const formatSnakeToTitle = (value) => {
    return value
      ?.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    if (!role.name || role.permissions.length === 0) {
      message.error("Please fill in all the required fields.");
    }
    setAdminDetails((prev) => [{ ...prev, role: role.name }]);

    setIsCreateRoleOpen(false);
    setSuccessCreateRole(true);
  };

  const SUCCESS_MESSAGES = {
    super_admin: {
      title: "Super Admin Added Successfully!",
      message: `You have successfully added a new Super Admin. An invitation email has been sent to ${adminDetails.email} to set up their account.`,
    },
    admin: {
      title: "Admin Added Successfully!",
      message: `You have successfully added a new Admin. An invitation email has been sent to ${adminDetails.email} to set up their account.`,
    },
    viewer: {
      title: "Viewer Added Successfully!",
      message: `You have successfully assigned a new Viewer. An invitation email has been sent to ${adminDetails.email} to set up their account.`,
    },
  };

  return (
    <div>
      {memberModal && (
        <AddMember
          memberModal={memberModal}
          setMemberModal={setMemberModal}
          onConfirm={openConfirmModal}
          onProceed={addAdminMember}
          adminDetails={adminDetails}
          setAdminDetails={setAdminDetails}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setEditMemberId={setEditMemberId}
          formatSnakeToTitle={formatSnakeToTitle}
        />
      )}

      {confirmAddAdmin && (
        <ConfirmAddAdmin
          onCancel={() => setConfirmAddAdmin(false)}
          onProceed={addAdminMember}
          newMember={newMember}
          formatSnakeToTitle={formatSnakeToTitle}
        />
      )}
      {successModal && adminDetails.role && (
        <SuccessModal successMessage={SUCCESS_MESSAGES[adminDetails.role]} />
      )}
      {successChangeModal && (
        <SuccessModal
          successMessage="Changes Saved Successfully!"
          adminDetails={adminDetails}
        />
      )}

      {deleteSuperAdminModal && (
        <DeleteSuperAdmin
          deleteSuperAdminModal={deleteSuperAdminModal}
          setDeleteSuperAdminModal={setDeleteSuperAdminModal}
          setTransferConfirmModal={setTransferConfirmModal}
        />
      )}
      {deleteMemberModal && (
        <DeleteMember
          onCancel={() => setDeleteMemberModal(false)}
          onConfirm={confirmDeleteMember}
        />
      )}
      {isDeleted && (
        <ShortSuccessMessage successMessage="Member Deleted successfully" />
      )}
      {transferConfirmModal && (
        <ShortPopup
          successMessage="
            Ownership has been successfully transferred, Your account will now
            be deleted."
        />
      )}
      {isCreateRoleOpen && (
        <CreateRole
          handleCreateRoleSubmit={handleCreateRoleSubmit}
          setIsCreateRoleOpen={setIsCreateRoleOpen}
          setSuccessCreateRole={setSuccessCreateRole}
          role={role}
          setRole={setRole}
        />
      )}
      {successCreateRole && (
        <ShortSuccessMessage successMessage="Role Created Successfully!" />
      )}
      <div
        className={`border-b-1 p-3 ${
          isDarkMode ? `bg-black` : `bg-off-white`
        } h-screen`}
      >
        <div
          className={`flex justify-between items-center w-full  ${
            isDarkMode
              ? `bg-black border-b-[#787878]`
              : `bg-off-white border-b-near-white`
          } border-b-2 pb-3`}
        >
          {/* <Link to="/reset-password">Go to invite admin page</Link> */}
          <h1>General</h1>
          <div className="flex items-center  gap-2">
            <Link to="/dashboard/general-settings/manage-permissions">
              <button
                //   onClick={() => {
                //     //  setIsSettingsModal(!isSettingsModal);
                //   }}
                className="flex justify-end gap-1 p-2 rounded-md border-2 border-primary cursor-pointer ml-auto items-center"
              >
                <RiSettings5Line fill="#9966CC" />
                <span className="text-primary text-xs">
                  View Permission Details
                </span>
              </button>
            </Link>
            <button
              className="bg-primary btn-primary px-3"
              onClick={() => setIsCreateRoleOpen(true)}
            >
              Create a role
            </button>
          </div>
        </div>
        <div className="pt-3 flex justify-between items-start w-full">
          {loading ? (
            <LoadingState />
          ) : (
            <div className={`w-full p-3`}>
              <div
                className={`${
                  isDarkMode ? `bg-grayBlack` : `bg-white`
                } flex justify-between mb-4 rounded-xl p-5`}
              >
                <div className="text-sm">
                  <h2 className="font-bold">Admin managament</h2>
                  <p
                    className={`pt-2 ${
                      isDarkMode ? "text-white" : "text-off-black"
                    } opacity-80`}
                  >
                    Manage administrative access for the system
                  </p>
                </div>
                <div
                  onClick={() => {
                    setMemberModal(true);
                    !isEditing &&
                      setAdminDetails({ name: "", email: "", role: "" });
                  }}
                  className="flex gap-3 items-center cursor-pointer"
                >
                  <IoMdAdd fill="#9966CC" />
                  <p className="text-primary text-xs font-bold">Add member</p>
                </div>
              </div>

              {newMember?.map((member) => (
                <div
                  key={member.id}
                  className={`${
                    isDarkMode ? `bg-grayBlack` : `bg-white`
                  } rounded-xl flex justify-between align-top items-start w-full text-sm p-5 mb-4`}
                >
                  <div className="">
                    {member.role !== "super_admin" && (
                      <p className="pb-5 font-bold">
                        {formatSnakeToTitle(member.name)}
                      </p>
                    )}
                    {member.members?.map((persons) => (
                      <div key={persons.id}>
                        {" "}
                        <p className="capitalize">{persons?.full_name}</p>
                        <p
                          className={`text-xs  ${
                            isDarkMode ? `text-off-white` : `text-off-black`
                          }  opacity-80`}
                        >
                          {persons?.email}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="relative">
                    <p
                      onClick={() =>
                        navigate("/dashboard/general-settings/manage-admin")
                      }
                      className="cursor-pointer text-primary font-bold text-xs"
                    >
                      Manage Role
                    </p>
                    {isOpenOptions === member.id && (
                      <div
                        className={`rounded-lg ${
                          isDarkMode
                            ? `text-white bg-[#292929]`
                            : `text-black bg-white`
                        } w-[120px]  border border-[#787878] h-fit absolute top-5 right-0 z-10 shadow-lg`}
                      >
                        <p
                          onClick={() => {
                            setAdminDetails({
                              name: member.full_name,
                              email: member.email,
                              role: member.role,
                            });
                            setIsEditing(true);
                            setEditMemberId(member.id);
                            setMemberModal(true);
                            setIsOpenOptions(-1);
                          }}
                          className="border-b border-[#787878] p-2 cursor-pointer"
                        >
                          Edit
                        </p>
                        <p
                          onClick={() => {
                            member.role === "Super admin"
                              ? setDeleteSuperAdminModal(true)
                              : setDeleteMemberModal(true);
                            setIsOpenOptions(false);
                            setMemberToDelete(member.id);
                          }}
                          className="p-2 text-[#E53935] cursor-pointer"
                        >
                          Delete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
