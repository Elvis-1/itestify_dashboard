import { useContext } from "react";
import PropTypes from "prop-types";
import avatarProfile from "../../assets/images/no-pfp.png";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import "../../styles/animation.css";

const UserRegProfile = ({ registeredUsers, setProfile }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  if (!registeredUsers) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      {/* Modal container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md shadow-lg  size-[90%]">
        <div className="modal relative rounded-2xl overflow-hidden">
          {/* Close Icon */}
          <div className="absolute top-2 right-2 cursor-pointer z-10 ">
            <MdClose
              onClick={() => setProfile(false)}
              className="text-2xl text-white hover:text-red-500"
            />
          </div>

          {/* Header with profile image */}
          <div
            className={`h-36 w-full relative rounded-t-2xl  ${
              isDarkMode ? `bg-[#292929]` : `bg-off-white`
            }`}
          >
            <img
              className="w-24 h-24 rounded-full absolute top-[60%] left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md"
              src={registeredUsers?.profile_image || avatarProfile}
              alt={`${registeredUsers?.full_name} picture`}
            />
          </div>

          {/* Main content */}
          <div
            className={`p-4 pt-16 rounded-b-2xl overflow-y-auto max-h-[70vh] hide-scrollbar ${
              isDarkMode ? `bg-[#171717] text-white` : `bg-white text-black`
            }`}
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <p>User ID</p>
                <p>{registeredUsers?.id || "----"}</p>
              </div>
              <div className="flex justify-between">
                <p>Name</p>
                <p>{registeredUsers?.full_name || "----"}</p>
              </div>
              <div className="flex justify-between">
                <p>Email</p>
                <p>{registeredUsers?.email || "----"}</p>
              </div>
              <div className="flex justify-between">
                <p>Status</p>
                <p className="text-green-600 font-semibold">Registered</p>
              </div>
              <div className="flex justify-between">
                <p>Registration Date</p>
                <p>
                  {new Date(registeredUsers?.created_at).toLocaleDateString() ||
                    "----"}
                </p>
              </div>
            </div>

            <hr className="my-4 border-gray-300" />

            <div>
              <h1>Account timeline</h1>
              <div className="flex justify-between items-center mb-5 mt-6">
                <p>Deactivated On</p>
                <p>22/04/2025</p>
              </div>
              <div className="w-[100%] h-[20%] bg-[#292929] p-4 rounded-lg text-sm">
                <p className="mb-4 text-[18px]">Deactivation Reason</p>
                <p>
                  Multiple policy violations including spam content and
                  inappropriate behavior. User failed to respond to warnings
                  within the required timeframe.
                </p>
                <p className="mt-5">By Ore Adu (Admin)</p>
              </div>
              <div className="flex justify-between items-center mb-5 mt-6">
                <p>Reactivate On</p>
                <p>22/04/2025</p>
              </div>
              <div className="w-[100%] h-[20%] bg-[#292929] p-4 rounded-lg text-sm">
                <p className="mb-4 text-[18px]">Reactivation Reason</p>
                <p>
                  Multiple policy violations including spam content and
                  inappropriate behavior. User failed to respond to warnings
                  within the required timeframe.
                </p>
                <p className="mt-5">By Ore Adu (Admin)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserRegProfile.propTypes = {
  registeredUsers: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    full_name: PropTypes.string,
    email: PropTypes.string,
    profile_image: PropTypes.string,
    created_at: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    history: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        date: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),
        reason: PropTypes.string,
      })
    ),
  }),
  setProfile: PropTypes.func.isRequired,
};

export default UserRegProfile;
