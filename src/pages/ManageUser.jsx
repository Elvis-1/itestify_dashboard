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

const ManageUser = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tabState, setTabState] = useState("addNewUser");
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
                className={`w-full text-center rounded-none border-b-2  ${
                  tabState === "addNewUser"
                    ? `border-primary bg-transparent text-white`
                    : `border-transparent text-near-white`
                }   cursor-pointer`}
                onClick={() => setTabState("addNewUser")}
              >
                Add New User
              </p>

              <p
                value="removeExistingUser"
                className={`w-full text-center rounded-none border-b-2  ${
                  tabState === "removeUser"
                    ? `border-primary bg-transparent text-white`
                    : `border-transparent text-near-white`
                }   cursor-pointer`}
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
                      className="bg-primary hover:bg-purple-800 cursor-pointer mt-24 w-full text-center p-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-bold">Select Users to remove</p>

                  <div className="flex justify-between items-center py-3 w-full">
                    <div>
                      <p>Elvis Igbebior</p>
                      <p>elvisigbibor@gmail.com</p>
                    </div>
                    <input
                      type="checkbox"
                      //  name={`remove-${user.id}`}
                      //  id={`remove-${user.id}`}
                      //  checked={selectedUserIdRemove?.includes(user.id)}
                      //  onChange={() => handleSelectRemove(user.id)}
                    />
                  </div>

                  <button
                    //  onClick={() => setShowConfirmRemoveModal(true)}
                    className="bg-[#D72638] hover:bg-red-800 cursor-pointer mt-24 w-full text-center p-2"
                    //  disabled={selectedUserIdRemove.length < 1}
                  >
                    Remove
                  </button>
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

export default ManageUser;
