import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { RiSettings5Line } from "react-icons/ri";
import { DarkModeContext } from "../context/DarkModeContext";
import { IoMdAdd } from "react-icons/io";
import AddMemeber from "../component/generalSettingsPopups/AddMemeber";
import ConfirmAddAdmin from "../component/generalSettingsPopups/ConfirmAddAdmin";
import SuccessModal from "../component/generalSettingsPopups/SuccessModal";
import DeleteSuperAdmin from "../component/generalSettingsPopups/DeleteSuperAdmin";
import ShortPopup from "../component/generalSettingsPopups/ShortPopup";
import { MdOutlineMoreHoriz } from "react-icons/md";
import DeleteMember from "../component/generalSettingsPopups/DeleteMember";
import ShortSuccessMessage from "../component/generalSettingsPopups/ShortSuccessMessage";
import axios from "axios";
import { message } from "antd";
import LoadingState from "../component/LoadingState"

const GeneralSettings = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [memberModal, setMemberModal] = useState(false);
  const [confirmAddAdmin, setConfirmAddAdmin] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successChangeModal, setSuccessChangeModal] = useState(false);
  const [deleteSuperAdminModal, setDeleteSuperAdminModal] = useState(false);
  const [deleteMemberModal, setDeleteMemberModal] = useState(false);
  const [transferConfirmModal, setTransferConfirmModal] = useState(false);

  const [newMember, setNewMember] = useState([]);
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);

  const [isDeleted, setIsDeleted] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? -1 : index);
  };
  const openConfirmModal = () => {
    setMemberModal(false);
    setConfirmAddAdmin(true);
  };

  //FETCH ALL ADMINS MEMEBERS
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auths/members/list-members/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNewMember(response.data.data);
      } catch (error) {
        message.error(error.response.data.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  //ADD NEW MEMEBERS AND UPDATE EXISTING MEMEBERS
  const addAdminMember = async (e) => {
    e.preventDefault();

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
        const response = await axios.patch(
          `${
            import.meta.env.VITE_API_URL
          }/auths/members/${editMemberId}/update-member/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
        setIsEditing(false);
        setEditMemberId(null);
        setSuccessChangeModal(true);
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auths/members/create-member/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
        error?.response?.data?.message ||
          "Failed to add member. Please try again."
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
  }, [successModal, transferConfirmModal, successChangeModal, isDeleted]);

  //DELETE ADMIN MEMBERS
  const confirmDeleteMember = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/auths/members/${memberToDelete}/delete-member/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const SUCCESS_MESSAGES = {
    "Super admin": {
      title: "Super Admin Added Successfully!",
      message: `You have successfully added a new Super Admin. An invitation email has been sent to ${adminDetails.email} to set up their account.`,
    },
    Admin: {
      title: "Admin Added Successfully!",
      message: `You have successfully added a new Admin. An invitation email has been sent to ${adminDetails.email} to set up their account.`,
    },
    Viewer: {
      title: "Viewer Added Successfully!",
      message: `You have successfully assigned a new Viewer. An invitation email has been sent to ${adminDetails.email} to set up their account.`,
    },
  };

  return (
    <div>
      {memberModal && (
        <AddMemeber
          memberModal={memberModal}
          setMemberModal={setMemberModal}
          onConfirm={openConfirmModal}
          onProceed={addAdminMember}
          adminDetails={adminDetails}
          setAdminDetails={setAdminDetails}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}

      {confirmAddAdmin && (
        <ConfirmAddAdmin
          onCancel={() => setConfirmAddAdmin(false)}
          onProceed={addAdminMember}
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
          {/* <Link to="/invite">Go to invite admin page</Link> */}
          <h1>General</h1>
          <Link to="/dashboard/manage-permissions">
            <button
              //   onClick={() => {
              //     //  setIsSettingsModal(!isSettingsModal);
              //   }}
              className="flex justify-end gap-1 p-3 rounded-md bg-primary cursor-pointer ml-auto items-center"
            >
              <RiSettings5Line fill="#ffffff" />
              <span className="text-white text-xs">Manage Permissions</span>
            </button>
          </Link>
        </div>
        <div className="pt-3 flex justify-between items-start w-full">
          {loading ? (
            <LoadingState />
          ) : (
            <div
              className={`w-full p-3 pb-6 rounded-lg ${
                isDarkMode ? `bg-grayBlack` : `bg-white`
              }`}
            >
              <div className="flex justify-between">
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
                  onClick={() => setMemberModal(true)}
                  className="flex gap-3 items-center cursor-pointer"
                >
                  <IoMdAdd fill="#9966CC" />
                  <p className="text-primary text-xs font-bold">Add member</p>
                </div>
              </div>

              {newMember?.map((member) => (
                <div
                  key={member.id}
                  className={`flex justify-between  align items-center w-full text-sm pt-4 pb-6`}
                >
                  <div className="">
                    <p>{member.full_name}</p>
                    <p
                      className={`pt-1  ${
                        isDarkMode ? `text-white` : `text-off-black`
                      }  opacity-80`}
                    >
                      {member.email}
                    </p>
                  </div>
                  <div></div>
                  <div className="flex justify-between items-center w-full gap-96">
                    <p
                      className={`ml-auto ${
                        member.role === "Super admin"
                          ? `text-near-white`
                          : `text-primary`
                      } `}
                    >
                      {member.role}
                    </p>
                    <div className="relative">
                      <MdOutlineMoreHoriz
                        onClick={() => {
                          toggleOptions(member.id);
                        }}
                        className="cursor-pointer"
                      />
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
