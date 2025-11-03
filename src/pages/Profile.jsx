import { MdOutlineEdit } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

const Profile = () => {
  const [updateProfile, setUpdateProfile] = useState(false);
  const [updateEmail, setUpdateEmail] = useState(false); 
  const [isLoadingNameNumber, setIsLoadingNameNumber] = useState(false); 
  const [isLoadingEmail, setIsLoadingEmail] = useState(false); 
  const [fullName, setFullName] = useState("Ore ore");
  const [mobileNumber, setMobileNumber] = useState("Not Yet Available");
  const [email, setEmail] = useState("Fife@yopmail.com");
  const [highlightEmpty, setHighlightEmpty] = useState({
    fullName: false,
    mobileNumber: false,
    email: false,
    otp: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [originalEmail, setOriginalEmail] = useState(email);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInputs, setPasswordInputs] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const [passwordValidationStatus, setPasswordValidationStatus] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    match: false,
  });

  const [emailInputVisible, setEmailInputVisible] = useState(true);
  const [newEmailDisplay, setNewEmailDisplay] = useState("");
  const [showSendOtpPrompt, setShowSendOtpPrompt] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showFinalEmailChangeForm, setShowFinalEmailChangeForm] =
    useState(false);
  const [formerEmailInput, setFormerEmailInput] = useState("");
  const [newEmailConfirmInput, setNewEmailConfirmInput] = useState("");
  const [isFinalEmailSaving, setIsFinalEmailSaving] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const { new: newPassword, confirm } = passwordInputs;

    const lengthValid = newPassword.length >= 8;
    const uppercaseValid = /[A-Z]/.test(newPassword);
    const lowercaseValid = /[a-z]/.test(newPassword);
    const numberValid = /[0-9]/.test(newPassword);
    const specialCharValid = /[!@#$%^&*]/.test(newPassword);
    const matchValid = newPassword === confirm && newPassword !== "";

    setPasswordValidationStatus({
      length: lengthValid,
      uppercase: uppercaseValid,
      lowercase: lowercaseValid,
      number: numberValid,
      specialChar: specialCharValid,
      match: matchValid,
    });

    if (
      lengthValid &&
      uppercaseValid &&
      lowercaseValid &&
      numberValid &&
      specialCharValid &&
      matchValid
    ) {
      setPasswordError("");
    }
  }, [passwordInputs]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const allPasswordRequirementsMet = Object.values(
    passwordValidationStatus
  ).every((status) => status);

  const handlePasswordUpdate = async () => {
    const { current, new: newPassword, confirm } = passwordInputs;
    if (!current || !newPassword || !confirm) {
      setPasswordError("Please fill in all fields.");
      return;
    }

    if (!allPasswordRequirementsMet) {
      if (!passwordValidationStatus.length)
        setPasswordError("Password must be at least 8 characters long.");
      else if (!passwordValidationStatus.uppercase)
        setPasswordError("Password must contain an uppercase letter.");
      else if (!passwordValidationStatus.lowercase)
        setPasswordError("Password must contain a lowercase letter.");
      else if (!passwordValidationStatus.number)
        setPasswordError("Password must contain a number.");
      else if (!passwordValidationStatus.specialChar)
        setPasswordError("Password must contain a special character.");
      else if (!passwordValidationStatus.match)
        setPasswordError("Passwords do not match.");
      return;
    }

    setIsLoadingNameNumber(true); 

    setTimeout(() => {
      setIsLoadingNameNumber(false);
      setShowPasswordModal(false);
      setPasswordInputs({ current: "", new: "", confirm: "" });

      const messageBox = document.createElement("div");
      messageBox.className =
        "fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50";
      messageBox.innerHTML = `
        <div class="bg-[#171717] p-8 rounded-lg shadow-lg text-white text-center">
          <p class="text-xl mb-4">Password updated successfully!</p>
          <button id="closeMessageBox" class="bg-[#9966CC] hover:bg-[#7d56b6] text-white px-6 py-2 rounded-md">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById("closeMessageBox").onclick = () =>
        document.body.removeChild(messageBox);
    }, 1500);
  };

  const sendOtpToEmail = async (targetEmail) => {
    console.log(`Sending OTP to ${targetEmail}...`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  };

  const verifyOtp = async (enteredOtp) => {
    const expectedOtp = "1234"; 
    return new Promise((resolve) =>
      setTimeout(() => resolve(enteredOtp === expectedOtp), 500)
    );
  };

  const handleOtpVerification = async () => {
    if (otp.trim() === "") {
      setHighlightEmpty((prev) => ({ ...prev, otp: true }));
      setTimeout(
        () => setHighlightEmpty((prev) => ({ ...prev, otp: false })),
        2000
      );
      return;
    }

    setIsVerifyingOtp(true);
    const isVerified = await verifyOtp(otp);
    setIsVerifyingOtp(false);

    if (!isVerified) {
      const messageBox = document.createElement("div");
      messageBox.className =
        "fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50";
      messageBox.innerHTML = `
      <div class="bg-[#171717] p-8 rounded-lg shadow-lg text-white text-center">
        <p class="text-xl mb-4">Invalid OTP. Please try again.</p>
        <button id="closeMessageBox" class="bg-[#9966CC] hover:bg-[#7d56b6] text-white px-6 py-2 rounded-md">OK</button>
      </div>
    `;
      document.body.appendChild(messageBox);
      document.getElementById("closeMessageBox").onclick = () =>
        document.body.removeChild(messageBox);
      return;
    } else {
      setShowOtpInput(false);
      setOtpSent(false);
      setShowFinalEmailChangeForm(true);
      setFormerEmailInput(""); 
      setNewEmailConfirmInput(""); 
    }
  };

  const handleNameNumberSave = async () => {
    const empty = {
      fullName: fullName.trim() === "",
      mobileNumber: mobileNumber.trim() === "",
    };

    if (empty.fullName || empty.mobileNumber) {
      setHighlightEmpty(empty);
      setTimeout(() => {
        setHighlightEmpty({
          fullName: false,
          mobileNumber: false,
        });
      }, 2000);
      return;
    }

    setIsLoadingNameNumber(true);
    setTimeout(() => {
      setIsLoadingNameNumber(false);
      setUpdateProfile(false);
    }, 2000);
  };

  const handleEmailSave = async () => {
    setUpdateEmail(false);
  };

  const handleSendOtpClick = async () => {
    setIsSendingOtp(true);
    await sendOtpToEmail(originalEmail);
    setOtpSent(true);
    setShowOtpInput(true);
    setShowSendOtpPrompt(false);
    setIsSendingOtp(false);
    setResendTimer(60); 
  };

  const handleFinalEmailSave = async () => {
    setIsFinalEmailSaving(true);

    setTimeout(() => {
      setIsFinalEmailSaving(false);
      setOriginalEmail(newEmailConfirmInput);
      setEmail(newEmailConfirmInput);
      setShowFinalEmailChangeForm(false);
      setUpdateEmail(false);
    }, 1500);
  };

  const isFinalEmailSaveEnabled =
    formerEmailInput.trim() !== "" &&
    newEmailConfirmInput.trim() !== "" &&
    !isFinalEmailSaving;

  return (
    <>
      <header className="h-[13%] w-[100%] flex justify-center items-center border-b-2">
        <div className="w-[97%] flex justify-between h-[70%] items-center">
          <div>
            <p className="text-[20px] font-semibold mb-2">Profile</p>
            <p className="text-[13px]">Manage your account information</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-[#9966CC] h-[73%] rounded-[10px] w-[15%] text-[13px]"
          >
            Change My Password
          </button>
        </div>
      </header>

      <div className="h-[25%] w-full flex items-center justify-center">
        <div className="h-[90%] w-[98%] flex items-center">
          <div className="h-[90%] w-[98%] flex items-center relative">
            <label
              htmlFor="profilePicture"
              className="h-[120px] w-[120px] rounded-full bg-white flex justify-center items-center relative group cursor-pointer overflow-hidden"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <BsPerson fill="black" size={50} />
              )}

              <div
                className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (profileImage) {
                    setShowDropdown((prev) => !prev);
                  } else {
                    document.getElementById("profilePicture")?.click();
                  }
                }}
              >
                <MdOutlineEdit className="text-white text-2xl" />
              </div>

              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                className="hidden bg-[#292929]"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setProfileImage(imageUrl);
                    setShowDropdown(false);
                  }
                }}
              />
            </label>

            {profileImage && showDropdown && (
              <div className="absolute top-[130px] left-2 w-[160px] bg-[#292929] rounded-md shadow-lg z-10 text-black text-sm">
                <ul className="flex flex-col">
                  <li
                    className="hover:bg-[#575757] hover:rounded-t-[5px] px-4 py-2 cursor-pointer text-white"
                    onClick={() =>
                      document.getElementById("profilePicture")?.click()
                    }
                  >
                    Change Picture
                  </li>
                  <li
                    className="hover:bg-[#575757] px-4 py-2 cursor-pointer text-white border-t-2"
                    onClick={() => {
                      setShowImageModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    View Picture
                  </li>
                  <li
                    className="hover:bg-[#575757] hover:rounded-b-[5px] px-4 py-2 cursor-pointer text-[#87312F] border-t-2"
                    onClick={() => {
                      setProfileImage(null);
                      setShowDropdown(false);
                    }}
                  >
                    Remove Picture
                  </li>
                </ul>
              </div>
            )}
          </div>

          {showImageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-[#171717] rounded-lg p-4 max-w-[90%] max-h-[90%] flex flex-col items-center h-[80%] w-[30%]">
                <div className="h-[10%] w-[100%] flex justify-between items-center p-2 border-b-2">
                  <p className="text-[30px] font-semibold">Profile Picture</p>
                  <button
                    className=" text-white rounded"
                    onClick={() => setShowImageModal(false)}
                  >
                    <MdCancel size={40} fill="white" />
                  </button>
                </div>
                <img
                  src={profileImage}
                  alt="Full View"
                  className="h-[80%] w-[95%] rounded-md  mt-8"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={` w-[100%] h-[73%] flex justify-center items-center`}>
        <div className="h-[95%] w-[97%] flex justify-center items-center">
          <form
            onSubmit={(e) => e.preventDefault()}
            className={`bg-[#171717] h-[100%] w-[100%] rounded-[10px] flex flex-col justify-between p-3`}
          >
            <div
              className={`w-[100%] ${
                !updateProfile ? "border-b-2  h-[45%]" : " mt-10"
              } flex flex-col justify-between items-center`}
            >
              <div className="h-[30%] w-[100%] flex justify-between items-center mt-3">
                <p className="text-[20px] font-semibold">
                  Personal Information
                </p>
                {updateProfile ? (
                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setUpdateProfile(false);
                      }}
                      className="flex items-center border border-[#9966CC] text-[#9966CC] px-4 py-2 rounded-[10px] transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleNameNumberSave}
                      className="flex items-center bg-[#9966CC] hover:bg-[#7d56b6] text-white px-4 py-2 rounded-[10px] transition-colors duration-200"
                    >
                      {isLoadingNameNumber ? (
                        <>
                          <span className="loader mr-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>Save Changes</>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setUpdateProfile(true)}
                    className="flex items-center text-[17px] text-[#9966CC]"
                  >
                    <MdOutlineEdit className="mr-1" />
                    Edit
                  </button>
                )}
              </div>

              {!updateProfile && (
                <div className="w-[100%] h-[75%] flex items-start flex-col gap-4 mt-7">
                  <p className="text-[16px]">Role</p>
                  <p className="mb-4">Super Admin</p>
                </div>
              )}
            </div>

            <div className="w-[100%] h-[25%] flex flex-col justify-center items-start gap-4">
              <p>Full Name</p>
              {updateProfile ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`rounded px-2 py-1 w-full bg-[#171717] text-white h-[60px] outline-none ${
                    highlightEmpty.fullName
                      ? "border-2 border-[#9966CC]"
                      : "border border-[#333]"
                  }`}
                />
              ) : (
                <p>{fullName}</p>
              )}
            </div>

            <div
              className={`w-[100%] h-[30%] ${
                !updateProfile ? "border-t-2" : ""
              } flex flex-col justify-center items-start gap-3`}
            >
              <p>Mobile Number</p>
              {updateProfile ? (
                <input
                  type="number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className={`rounded px-2 py-1 w-full bg-[#171717] text-white h-[60px] outline-none ${
                    highlightEmpty.mobileNumber
                      ? "border-2 border-[#9966CC]"
                      : "border border-[#333]"
                  }`}
                />
              ) : (
                <p>{mobileNumber}</p>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="w-[100%] flex justify-center items-center mt-3">
        <div className="h-[100%] w-[97%] flex justify-center flex-col bg-[#171717] mb-5 rounded-[10px]">
          
          {!updateEmail && (
            <>
              <div className="w-full flex justify-between items-center p-3 mt-3">
                <p className="text-[20px] font-semibold">Contact Information</p>
                <button
                  type="button"
                  onClick={() => {
                    setUpdateEmail(true);
                    setShowSendOtpPrompt(true);
                    setEmailInputVisible(false);
                    setNewEmailDisplay(email);
                    setOtpSent(false);
                    setShowOtpInput(false);
                    setOtp("");
                    setShowFinalEmailChangeForm(false);
                  }}
                  className="flex items-center text-[17px] text-[#9966CC]"
                >
                  <MdOutlineEdit className="mr-1" />
                  Edit
                </button>
              </div>
              <div className="w-full p-3 flex flex-col gap-1">
                <p className="text-[16px]">Email Address</p>
                <p className="text-[16px] text-white mb-7">{email}</p>
              </div>
            </>
          )}

          
          {updateEmail && !showOtpInput && !showFinalEmailChangeForm && (
            <>
              <div className="w-full flex justify-between items-center p-3 mt-3">
                <div className="flex flex-col gap-1">
                  <p className="text-[20px] font-semibold">
                    Contact Information
                  </p>
                  <p className="text-sm text-white">
                    To proceed, please click the button below to send a
                    verification code to your current email address.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUpdateEmail(false);
                    setEmail(originalEmail);
                    setEmailInputVisible(true);
                    setNewEmailDisplay("");
                    setShowSendOtpPrompt(false);
                    setOtpSent(false);
                    setShowOtpInput(false);
                    setShowFinalEmailChangeForm(false);
                    setOtp("");
                  }}
                  className="flex items-center border border-[#9966CC] text-[#9966CC] px-4 py-2 rounded-[10px] transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
              <div className="w-full p-3 flex flex-col gap-4">
                <p className="text-[16px] font-semibold">Email Address</p>
                <p className="text-[16px] text-white">{email}</p>
                <button
                  type="button"
                  onClick={handleSendOtpClick}
                  className="bg-[#9966CC] hover:bg-[#7d56b6] text-white px-4 py-2 rounded-[10px] transition-colors duration-200 w-[15%]"
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            </>
          )}

          
          {showOtpInput && otpSent && !showFinalEmailChangeForm && (
            <>
              <div className="w-full flex justify-between items-center p-3 mt-3">
                <div className="flex flex-col gap-1">
                  <p className="text-[20px] font-semibold">
                    Contact Information
                  </p>
                  <p className="text-sm text-white">
                    Please enter the OTP sent to {email} to continue.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUpdateEmail(false);
                    setEmail(originalEmail);
                    setEmailInputVisible(true);
                    setNewEmailDisplay("");
                    setShowSendOtpPrompt(false);
                    setOtpSent(false);
                    setShowOtpInput(false);
                    setShowFinalEmailChangeForm(false);
                    setOtp("");
                  }}
                  className="flex items-center border border-[#9966CC] text-[#9966CC] px-4 py-2 rounded-[10px] transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>

              <div className="w-full p-3 flex flex-col gap-4">
                <p className="text-[16px] font-semibold">Email Address</p>
                <p className="text-[16px] text-white">{email}</p>
                <p className="text-[16px] font-semibold">OTP</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4 digit code"
                    className={`rounded px-2 py-1 flex-grow bg-[#171717] text-white h-[60px] outline-none ${
                      highlightEmpty.otp
                        ? "border-2 border-[#9966CC]"
                        : "border border-[#333]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleOtpVerification}
                    disabled={otp.trim() === "" || isVerifyingOtp}
                    className={`px-4 py-2 rounded-[10px] transition-colors duration-200 h-[60px] ${
                      otp.trim() !== "" && !isVerifyingOtp
                        ? "bg-[#9966CC] hover:bg-[#7d56b6] text-white"
                        : "bg-[#8B8B8B] text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify"}
                  </button>
                </div>
                <div className="text-sm mt-2">
                  Didn&apos;t receive an Email?{" "}
                  {resendTimer > 0 ? (
                    <span className="text-[#9966CC]">
                      You can request for another in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      onClick={handleSendOtpClick}
                      className="text-[#9966CC] hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {showFinalEmailChangeForm && (
            <div className="w-full p-3 space-y-4">
              <div className="flex flex-col gap-1">
                <p className="text-[16px] text-white">Former Email</p>
                <input
                  type="text"
                  value={formerEmailInput}
                  onChange={(e) => setFormerEmailInput(e.target.value)}
                  className="w-full h-[60px] p-2 rounded bg-[#232323] text-white outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[16px] text-white">New Email</p>
                <input
                  type="text"
                  value={newEmailConfirmInput}
                  onChange={(e) => setNewEmailConfirmInput(e.target.value)}
                  className="w-full h-[60px] p-2 rounded bg-[#232323] text-white outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleFinalEmailSave}
                disabled={!isFinalEmailSaveEnabled}
                className={`flex items-center px-4 py-2 rounded-[10px] transition-colors duration-200 justify-center ${
                  isFinalEmailSaveEnabled
                    ? "bg-[#9966CC] hover:bg-[#7d56b6] text-white"
                    : "bg-[#8B8B8B] text-gray-400 cursor-not-allowed"
                }`}
              >
                {isFinalEmailSaving ? (
                  <>
                    <span className="loader mr-2"></span>
                    Saving...
                  </>
                ) : (
                  <>Save</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center mt-10">
          <div className="bg-[#171717] mb-4 rounded-lg w-[33%]  overflow-y-auto flex justify-center items-center flex-col">
            <div className="flex justify-between items-center mb-4 border-b-2 p-4 w-[100%]">
              <h2 className="text-white text-xl font-semibold ">
                Change Password
              </h2>
              <button onClick={() => setShowPasswordModal(false)}>
                <MdCancel size={28} className="text-white" />
              </button>
            </div>

            <div className=" h-[95%] w-[90%] flex flex-col gap-2">
              <p className="text-[18px] text-white">Current Password</p>
              <input
                type="password"
                placeholder="Current Password"
                value={passwordInputs.current}
                onChange={(e) =>
                  setPasswordInputs({
                    ...passwordInputs,
                    current: e.target.value,
                  })
                }
                className="w-[100%] h-[8%] p-2 rounded bg-[#232323] text-white outline-none"
              />
              <p className="text-[18px] text-white">New Password</p>
              <input
                type="password"
                placeholder="New Password"
                value={passwordInputs.new}
                onChange={(e) =>
                  setPasswordInputs({ ...passwordInputs, new: e.target.value })
                }
                className="w-[100%] h-[8%] p-2 rounded bg-[#232323] text-white outline-none"
              />
              <p className="text-[18px] text-white">Confirm Password</p>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordInputs.confirm}
                onChange={(e) =>
                  setPasswordInputs({
                    ...passwordInputs,
                    confirm: e.target.value,
                  })
                }
                className="w-[100%] h-[8%] p-2 rounded bg-[#232323] text-white outline-none"
              />

              <div className="text-white mt-3 h-[35%] w-[100%] flex flex-col gap-2 text-[14px]">
                <p className="text-[18px]">Password Must:</p>
                <p className="flex items-center justify-between">
                  <span>Be At least 8 characters long</span>
                  {passwordValidationStatus.length && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                </p>
                <p className="flex items-center justify-between">
                  <span>Contains at least one uppercase letter (A-Z)</span>
                  {passwordValidationStatus.uppercase && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                </p>
                <p className="flex items-center justify-between">
                  <span>Contains at least one lowercase letter (a-z)</span>
                  {passwordValidationStatus.lowercase && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                </p>
                <p className="flex items-center justify-between">
                  <span>Contains at least one number (0-9)</span>
                  {passwordValidationStatus.number && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                </p>
                <p className="flex items-center justify-between">
                  <span>
                    Contains at least one special character (!@#$%^&*)
                  </span>
                  {passwordValidationStatus.specialChar && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                </p>
                <p className="flex items-center justify-between">
                  <span>Match the confirmation password</span>
                  {passwordValidationStatus.match && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                </p>
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}

              <div className="flex gap-4 items-center justify-end mt-4 border-t-2 pt-2 h-[15%]  mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordInputs({ current: "", new: "", confirm: "" });
                    setPasswordError("");
                    setShowPasswordModal(false);
                  }}
                  className="flex items-center border border-[#9966CC] text-[#9966CC] px-4 py-2 rounded-[10px] transition-colors duration-200 mt-4"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  disabled={!allPasswordRequirementsMet || isLoadingNameNumber}
                  className={`flex items-center px-4 py-2 rounded-[10px] transition-colors duration-200 mt-4 ${
                    allPasswordRequirementsMet && !isLoadingNameNumber
                      ? "bg-[#9966CC] hover:bg-[#7d56b6] text-white"
                      : "bg-[#8B8B8B] text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoadingNameNumber ? (
                    <>
                      <span className="loader mr-2"></span>
                      Updating...
                    </>
                  ) : (
                    <>Update Password</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;