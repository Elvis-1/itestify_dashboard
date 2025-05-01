import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
const WarningModal = ({ title, message, buttonText, onCancel, onReplace }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-black" : "bg-off-white"
        }`}
        onClick={onCancel}
      />
      <div className="relative z-10 modal ">
        <div
          className={`rounded-md px-5 py-8 shadow-lg text-center w-[450px] ${
            isDarkMode ? "bg-grayBlack" : "bg-off-white"
          } max-w-md`}
        >
          <h3 className="text-lg font-bold mb-4">{title}</h3>
          <p
            className={`mb-6 text-sm ${
              isDarkMode ? `text-off-white` : `text-off-black`
            }`}
          >
            {message}
          </p>
          <div className="flex justify-end gap-4 pt-6">
            <button
              className={`btn-secondary ${
                isDarkMode ? "" : "text-primary border-primary"
              }`}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button className="btn-primary px-4" onClick={onReplace}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WarningModal;
