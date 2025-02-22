import React, { useContext, useEffect, useState } from "react";
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

const GeneralSettings = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [memberModal, setMemberModal] = useState(false);
  const [confirmAddAdmin, setConfirmAddAdmin] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successChangeModal, setSuccessChangeModal] = useState(false);
  const [deleteSuperAdminModal, setDeleteSuperAdminModal] = useState(false);
  const [deleteMemberModal, setDeleteMemberModal] = useState(false);
  const [transferConfirmModal, setTransferConfirmModal] = useState(false);
  const [newMember, setNewMember] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);
  const [currentMemberDetails, setCurrentMemberDetails] = useState({});
  const [isDeleted, setIsDeleted] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? -1 : index);
  };
  const openConfirmModal = () => {
    setMemberModal(false);
    setConfirmAddAdmin(true);
  };

  const addAdminMember = (e) => {
    e.preventDefault();
    if (!adminDetails.name || !adminDetails.email || !adminDetails.role) {
      alert("Details missing");
      return;
    }

    if (isEditing) {
      setNewMember((prev) =>
        prev.map((member) =>
          member.id === editMemberId
            ? { ...member, value: { ...adminDetails } }
            : member
        )
      );

      setIsEditing(false);
      setEditMemberId(null);
      setSuccessChangeModal(true);
    } else {
      const details = {
        id: Math.floor(Math.random() * 1000),
        value: { ...adminDetails },
      };
      setNewMember((prev) => [...prev, details]);
      setSuccessModal(true);
    }
    setConfirmAddAdmin(false);
    setSelectedRole(adminDetails.role);
    setTimeout(() => {
      setAdminDetails({ name: "", email: "", role: "" });
    }, 5000);
    setMemberModal(false);
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

  const editAdminMember = (id) => {
    const userMemberMatch = newMember.find((mem) => mem.id === id);
    setIsOpenOptions(-1);
    if (userMemberMatch) {
      setAdminDetails({ ...userMemberMatch.value });
      setIsEditing(true);
      setEditMemberId(id);
      setMemberModal(true);
    } else {
      console.error("User not found");
    }
  };
  const deleteMember = (id) => {
    const memberToRemove = newMember.find((mem) => mem.id === id);

    if (!memberToRemove) return;

    if (memberToRemove.value.role === "Super admin") {
      setDeleteSuperAdminModal(true);
      return;
    }

    setMemberToDelete(id);
    setDeleteMemberModal(true);
  };

  const confirmDeleteMember = () => {
    if (memberToDelete !== null) {
      setNewMember((prev) => prev.filter((mem) => mem.id !== memberToDelete));
      setMemberToDelete(null);
      setDeleteMemberModal(false);
      setIsDeleted(true);
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
  console.log("Admin Role:", adminDetails.role);
  console.log("Success Message Object:", SUCCESS_MESSAGES[adminDetails.role]);

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
          currentMemberDetails={currentMemberDetails}
          setCurrentMemberDetails={setCurrentMemberDetails}
        />
      )}

      {confirmAddAdmin && (
        <ConfirmAddAdmin
          onCancel={() => setConfirmAddAdmin(false)}
          onProceed={addAdminMember}
        />
      )}
      {successModal && selectedRole && (
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
          onConfirm={confirmDeleteMember} // Correct function now
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
          <h1>General</h1>
          <button
            //   onClick={() => {
            //     //  setIsSettingsModal(!isSettingsModal);
            //   }}
            className="flex justify-end gap-1 p-2  rounded-md bg-primary cursor-pointer ml-auto items-center"
          >
            <RiSettings5Line fill="#ffffff" />
            <span className="text-white text-xs">Manage Permissions</span>
          </button>
        </div>
        <div className="pt-3 flex justify-between items-start w-full">
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

            {newMember.map((member) => (
              <div
                key={member.id}
                className={`flex justify-between  align items-center w-full text-sm pt-4 pb-6 pr-6`}
              >
                <div className="">
                  <p>{member.value.name}</p>
                  <p
                    className={`pt-1  ${
                      isDarkMode ? `text-white` : `text-off-black`
                    }  opacity-80`}
                  >
                    {member.value.email}
                  </p>
                </div>
                <p
                  className={` ${
                    member.value.role === "Super admin"
                      ? `text-near-white`
                      : `text-primary`
                  } `}
                >
                  {member.value.role}
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
                          editAdminMember(member.id);
                        }}
                        className="border-b border-[#787878] p-2 cursor-pointer"
                      >
                        Edit
                      </p>
                      <p
                        onClick={() => {
                          member.value.role === "Super admin"
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
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
