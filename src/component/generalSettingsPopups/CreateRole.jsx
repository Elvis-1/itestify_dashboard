import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const CreateRole = ({ setIsCreateRoleOpen, setSuccessCreateRole }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const permissions = [
    "User Management",
    "Testimony Management",
    "Review Management",
    "Privacy and Security Management",
  ];
  return (
    <div>
      {" "}
      <div className="fixed inset-0 z-50 ">
        {/* Non-clickable overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50`}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm shadow-2xl ">
          <div
            className={`rounded-2xl  modal ${
              isDarkMode ? "bg-near-black text-white" : "bg-white text-black"
            }`}
          >
            <h1 className="border-b-borderColor border-b-[1px] p-4">
              Create A Role
            </h1>
            <form className="p-4">
              <div className="flex flex-col gap-3">
                <p className="text-sm">Name</p>
                <input
                  className={`p-1 rounded-md ${
                    isDarkMode ? "bg-grayBlack" : "bg-off-white"
                  } placeholder:text-xs placeholder:pl-2`}
                  type="text"
                  placeholder="Enter Name"
                />
              </div>
              <div className="pt-5">
                <h3 className="text-sm font-bold">Assign Permissions</h3>
                {permissions.map((perm) => (
                  <div className="flex items-center justify-normal gap-4 pt-3">
                    <input type="checkbox" />
                    <p className="text-xs">{perm}</p>
                  </div>
                ))}
              </div>
              <div className="lg:pt-12 pt-5 flex justify-end items-center gap-4 pb-3">
                <button
                  className="btn-secondary border-primary text-primary"
                  onClick={() => setIsCreateRoleOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  onClick={() => {
                    setIsCreateRoleOpen(false);
                    setSuccessCreateRole(true);
                  }}
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
