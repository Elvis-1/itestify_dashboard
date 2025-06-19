import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import "../../styles/animation.css";
import { IoMdArrowDropdown } from "react-icons/io";

const ConfirmAddAdmin = ({
  onCancel,
  onProceed,
  formatSnakeToTitle,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const options = [
    { value: "admin", label: "Admin" },
    { value: "viewer", label: "Viewer" },
  ];
  const [transferDetails, setTransferDetails] = useState({ role: "" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-black" : "bg-off-white"
        }`}
      />
      <div className="relative z-10 modal ">
        <i
          onClick={onCancel}
          className="absolute w-24 top-4 -right-16 cursor-pointer"
        >
          <MdClose />
        </i>
        <div
          className={`rounded-md px-5 py-7 shadow-lg max-w-sm ${
            isDarkMode ? "bg-grayBlack" : "bg-off-white"
          } max-w-md`}
        >
          <h1 className="font-bold text-center">Add New Super Admin?</h1>
          <p
            className={`py-4 text-sm opacity-70 text-center ${
              isDarkMode ? "text-off-white" : "text-off-black"
            }`}
          >
            If you make this Member a super admin, select your new role below.
            You will remain super admin until they accept the invitation. Once
            accepted, you'll transfer to your selected role, or your account
            will be removed if no role is selected. Only one super admin is
            allowed at a time. Do you wish to proceed?"
          </p>
          <div className="flex flex-col gap-2 justify-normal">
            <p className="font-bold text-sm">Role</p>
            <button
              onClick={() => setIsOpenDropdown(!isOpenDropdown)}
              className={`w-full p-2 ${
                isDarkMode
                  ? `bg-off-black hover:bg-zinc-800`
                  : `bg-off-white hover:bg-near-white`
              } flex items-center justify-between
                           p-1 rounded-md outline-none text-sm placeholder:text-xs
                           transition-colors duration-200`}
            >
              <span className="text-sm opacity-80">
                {transferDetails.role
                  ? options.find((opt) => opt.value === transferDetails.role)
                      ?.label
                  : "Select"}
              </span>
              <IoMdArrowDropdown
                className={`w-5 h-5 transition-transform duration-200 
                            ${isOpenDropdown ? "transform rotate-180" : ""}`}
              />
            </button>
            {isOpenDropdown && (
              <div
                className={`absolute w-[340px] mt-20 rounded-lg border border-off-white outline-none text-sm placeholder:text-xs overflow-hidden  ${
                  isDarkMode ? `bg-grayBlack` : `bg-off-white`
                }`}
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setTransferDetails((prev) => ({
                        ...prev,
                        role: option.value,
                      }));
                      setIsOpenDropdown(false);
                    }}
                    className={`p-2 cursor-pointer ${
                      isDarkMode
                        ? `text-white hover:bg-zinc-800 border-b-off-white`
                        : `text-black hover:bg-near-white border-b-borderColor`
                    } text-sm
                     transition-colors duration-150 last-of-type:border-t first-of-type:border-b`}
                  >
                    {formatSnakeToTitle(option.label)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={`${
              isOpenDropdown ? "mt-36" : ""
            } flex justify-end text-sm  gap-4 mt-6`}
          >
            <button
              onClick={onCancel}
              className="text-primary border-primary border px-5 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              Yes, Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAddAdmin;
