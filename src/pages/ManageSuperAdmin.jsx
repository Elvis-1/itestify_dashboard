import {
  ArrowLeftOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import LoadingState from "../component/LoadingState";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../context/DarkModeContext";

const ManageSuperAdmin = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tabState, setTabState] = useState("transferUser");
  const [selectUserDropdown, setSelectUserDropdown] = useState(false);
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
                  <p>Assign user from another role</p>
                  <div
                    className="mb-6"
                    onClick={() => setSelectUserDropdown(true)}
                  >
                    <button className="w-full p-2 py-3 rounded-[8px] space-x-4 mt-3 border-[#9b9ea4] border-[1px] flex justify-between bg-transparent">
                      <span>Select User</span>

                      <DownOutlined className="w-3 h-3 ml-auto mt-2 mr-2" />
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
                        // onChange={(e) => {
                        //   setChangeRoleTransfer(true);
                        //   setActionTransferOption(e.target.value);
                        // }}
                      />
                      <label htmlFor="change-role">Change my role</label>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="option"
                        value="remove_access"
                        id="remove-access"
                        // onChange={(e) => {
                        //   setChangeRoleTransfer(false);
                        //   setActionTransferOption(e.target.value);
                        // }}
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
                          className={`p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm shadow-2xl ${
                            isDarkMode ? `bg-grayBlack` : `bg-off-white`
                          }`}
                        >
                          <div className="relative">
                            <MdClose
                              className="absolute right-10 top-10 cursor-pointer"
                              onClick={() => setSelectUserDropdown(false)}
                            />
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
                              <div className="flex justify-between w-full lg:items-center items-start py-2 border-b">
                                <div className="flex justify-normal items-center gap-10">
                                  <input
                                    type="checkbox"
                                    // name={`add-${user.id}`}
                                    // id={`add-${user.id}`}
                                    // checked={selectedUserIds.includes(user.id)}
                                    // onChange={() => handleSelectAdd(user.id)}
                                  />

                                  <div>
                                    <p>{"Unkown user"}</p>
                                    <p className="text-muted-foreground">
                                      elvisigbibor@gmail.com
                                    </p>
                                  </div>
                                </div>

                                <p className="text-nowrap lg:text-base text-xs">
                                  Super Admin
                                </p>
                              </div>
                              <div className="flex justify-between w-full lg:items-center items-start py-2 border-b">
                                <div className="flex justify-normal items-center gap-10">
                                  <input
                                    type="checkbox"
                                    // name={`add-${user.id}`}
                                    // id={`add-${user.id}`}
                                    // checked={selectedUserIds.includes(user.id)}
                                    // onChange={() => handleSelectAdd(user.id)}
                                  />

                                  <div>
                                    <p>{"Unkown user"}</p>
                                    <p className="text-muted-foreground">
                                      elvisigbibor@gmail.com
                                    </p>
                                  </div>
                                </div>

                                <p className=" text-nowrap lg:text-base text-xs">
                                  Super Admin
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* </div> */}

                    {/* <div className="flex justify-normal gap-5 items-start">
                <div className="flex justify-normal items-center align-middle gap-4 bg-[#F5F5F5] p-2 mt-4 w-fit">
                  <p>Faith Okereke</p>
                  <MdClose
                    fontSize={2}
                    className="w-4 h-4 mt-[2px] cursor-pointer"
                    //  onClick={() =>
                    //    setSelectedUserIds((prev) =>
                    //      prev.filter((id) => id !== user.id)
                    //    )
                    //  }
                  />
                </div>
              </div> */}

                    <button
                      //  onClick={() => setShowConfirmModal(true)}
                      className="btn-primary bg-primary hover:bg-purple-800 cursor-pointer mt-24 w-full text-center p-2"
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <p className="font-bold">Add New Super Admin Information</p>
                    <div className="flex justify-between items-center py-3 w-full">
                      <div className="flex flex-col gap-2 w-full">
                        <p className="font-semibold">Name</p>
                        <input
                          type="text"
                          // value={newSuperAdmin.name}
                          // onChange={(e) =>
                          //   setNewSuperAdmin({
                          //     ...newSuperAdmin,
                          //     name: e.target.value,
                          //   })
                          // }
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
                          // value={newSuperAdmin.email}
                          name="email"
                          // onChange={(e) =>
                          //   setNewSuperAdmin({
                          //     ...newSuperAdmin,
                          //     email: e.target.value,
                          //   })
                          // }
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
                            // onChange={(e) => {
                            //   setChangeRoleInvite(true);
                            //   setActionInviteOption(e.target.value);
                            // }}
                          />
                          <label htmlFor="change-role">Change my role</label>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="transfer"
                            id=""
                            value="remove_access"
                            // onChange={(e) => {
                            //   setChangeRoleInvite(false);
                            //   setActionInviteOption(e.target.value);
                            // }}
                          />
                          <label htmlFor="remove-access">
                            Delete my account
                          </label>
                        </div>
                      </div>

                      {/* {changeRoleInvite && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-full p-2 py-3 rounded-[8px] space-x-4 mt-3 border-[#9b9ea4] border-[1px] flex justify-between bg-transparent">
                              <span>
                                {selectedInviteRoleId
                                  ? adminRoles.find(
                                      (role) => role.id === selectedInviteRoleId
                                    )?.name
                                  : "Select Role"}
                              </span>

                              <img
                                src="/assets/icons/arrow-down.svg"
                                alt=""
                                className="w-4 h-4 ml-auto"
                              />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="w-[var(--radix-popper-anchor-width)] min-w-[var(--radix-popper-anchor-width)]"
                          >
                            {adminRoles.map((role, index) => (
                              <DropdownMenuItem
                                key={index}
                                className="w-full text-center px-4 py-2 hover:bg-gray-200"
                                onClick={() => setSelectedInviteRoleId(role.id)}
                              >
                                {role.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )} */}
                    </div>
                    <button
                      // disabled={
                      //   isLoadInvite ||
                      //   selectedInviteRoleId?.length === 0 ||
                      //   !actionInviteOption ||
                      //   (changeRoleInvite && !selectedInviteRoleId)
                      // }
                      // onClick={() => setShowConfirmInviteModal(true)}
                      className=" btn-primary
                                 bg-primary hover:bg-purple-800 cursor-pointer p-2 mt-24 w-full text-center"
                    >
                      Send invitation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirm Member Transfer Modal */}
        {/* <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
             <DialogContent className="w-full lg:max-w-lg max-w-sm p-4">
               <div className="lg:space-y-[40px] space-y-3 flex flex-col items-center">
                 <DialogHeader className="text-left">
                   <DialogTitle className="text-xl font-bold text-[#181818]">
                     Confirm Member Transfer?
                   </DialogTitle>
                 </DialogHeader>
                 <DialogDescription className="lg:text-base text-[12px] text-gray-700 text-left px-4 font-[500]">
                   You are about to add {selectedUserIds.length} selected user
                   {selectedUserIds.length > 1 && `s`} to this role. These users
                   will be removed from their current roles. Do you want to
                   proceed?
                 </DialogDescription>
               </div>
               <div className="flex items-center gap-2 justify-end lg:pt-5 pt-2">
                 <Button
                   className="border text-black border-[#023E8A] p-2 bg-transparent hover:bg-transparent cursor-pointer"
                   onClick={() => setShowConfirmModal(false)}
                 >
                   Cancel
                 </Button>
                 <Button
                   onClick={() => {
                     addUsersToRole();
                   }}
                   className="bg-[#023E8A] p-2 px-4 hover:bg-blue-700 cursor-pointer"
                 >
                    {isLoadAdd && (
                     <LoaderCircleIcon
                       stroke="#ffffff"
                       style={{ animation: "spin 1s linear infinite" }}
                     />
                   )}
                   Yes, Proceed
                 </Button>
               </div>
             </DialogContent>
           </Dialog>
    */}
        {/* Success Modal for Adding New User
           <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
             <DialogContent className="w-full lg:max-w-sm max-w-sm p-8">
               <div className="flex flex-col items-center">
                 <DialogHeader className="text-center">
                   <DialogTitle className="text-xl font-[500] text-[#181818]">
                     Success
                   </DialogTitle>
                 </DialogHeader>
                 <img
                   src="/assets/icons/blue-success.svg"
                   alt="Success"
                   className="w-20 h-20 my-6"
                 />
                 <DialogDescription className="lg:text-lg text-[14px] text-gray-700 text-center px-4 font-bold">
                   User Added Successfully
                 </DialogDescription>
               </div>
             </DialogContent>
           </Dialog> */}

        {/* Confirm Remove Users Modal
           <Dialog
             open={showConfirmRemoveModal}
             onOpenChange={setShowConfirmRemoveModal}
           >
             <DialogContent className="w-full lg:max-w-lg max-w-sm p-4">
               <div className="space-y-[40px] flex flex-col items-center">
                 <DialogHeader className="text-left">
                   <DialogTitle className="text-xl font-bold text-[#181818]">
                     Confirm Remove Users?
                   </DialogTitle>
                 </DialogHeader>
                 <DialogDescription className="lg:text-base text-[12px] text-gray-700 text-left px-4 font-[500]">
                   You are about to remove the selected users from{" "}
                   {currentRole?.name} role. They will no longer have access to
                   these role permissions. Do you want to proceed?
                 </DialogDescription>
               </div>
               <div className="flex items-center gap-2 justify-end pt-5">
                 <Button
                   className="border text-black border-[#023E8A] p-2 bg-transparent hover:bg-transparent cursor-pointer"
                   onClick={() => setShowConfirmRemoveModal(false)}
                 >
                   Cancel
                 </Button>
                 <Button
                   onClick={() => {
                     removeExistingUsers();
                   }}
                   className="bg-[#023E8A] p-2 px-4 hover:bg-blue-700 cursor-pointer"
                 >
                   {isLoadRemove && (
                     <LoaderCircleIcon
                       stroke="#ffffff"
                       style={{ animation: "spin 1s linear infinite" }}
                     />
                   )}
                   Yes, Proceed
                 </Button>
               </div>
             </DialogContent>
           </Dialog> */}

        {/* Success Modal for Removing Users
           <Dialog
             open={showSuccessRemoveModal}
             onOpenChange={setShowSuccessRemoveModal}
           >
             <DialogContent className="w-full lg:max-w-sm max-w-sm p-8">
               <div className="flex flex-col items-center">
                 <DialogHeader className="text-center">
                   <DialogTitle className="text-xl font-[500] text-[#181818]"></DialogTitle>
                 </DialogHeader>
                 <img
                   src="/assets/icons/blue-success.svg"
                   alt="Success"
                   className="w-20 h-20 my-6"
                 />
                 <DialogDescription className="lg:text-lg text-[14px] text-gray-700 text-center px-4 font-bold">
                   Users Removed Successfully
                 </DialogDescription>
               </div>
             </DialogContent>
           </Dialog> */}
      </main>
    </div>
  );
};

export default ManageSuperAdmin;
