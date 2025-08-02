import { MdOutlineEdit } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa"; // Import the checkmark icon

const Profile = () => {
  const [updateProfile, setUpdateProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("Ore ore");
  const [mobileNumber, setMobileNumber] = useState("Not Yet Available");
  const [email, setEmail] = useState("Fifee@yopmail.com");
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

  // New state for password validation rules
  const [passwordValidationStatus, setPasswordValidationStatus] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    match: false,
  });

  // States for the new email change flow
  const [emailInputVisible, setEmailInputVisible] = useState(true);
  const [newEmailDisplay, setNewEmailDisplay] = useState(""); // Stores the new email as text for display
  const [showSendOtpPrompt, setShowSendOtpPrompt] = useState(false); // Controls the "To proceed..." message and button
  const [isSendingOtp, setIsSendingOtp] = useState(false); // Loading state for sending OTP
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // Loading state for verifying OTP
  const [showFinalEmailChangeForm, setShowFinalEmailChangeForm] = useState(false); // Controls visibility of former/new email inputs
  const [formerEmailInput, setFormerEmailInput] = useState(""); // Input for former email in final form
  const [newEmailConfirmInput, setNewEmailConfirmInput] = useState(""); // Input for new email in final form
  const [isFinalEmailSaving, setIsFinalEmailSaving] = useState(false); // Loading state for final email save

  // Effect to validate password inputs and update status
  useEffect(() => {
    const { new: newPassword, confirm } = passwordInputs;

    const lengthValid = newPassword.length >= 8;
    const uppercaseValid = /[A-Z]/.test(newPassword);
    const lowercaseValid = /[a-z]/.test(newPassword);
    const numberValid = /[0-9]/.test(newPassword);
    const specialCharValid = /[!@#$%^&*]/.test(newPassword);
    const matchValid = newPassword === confirm && newPassword !== ""; // Ensure new password is not empty for match

    setPasswordValidationStatus({
      length: lengthValid,
      uppercase: uppercaseValid,
      lowercase: lowercaseValid,
      number: numberValid,
      specialChar: specialCharValid,
      match: matchValid,
    });

    // Clear password error if all rules are met
    if (lengthValid && uppercaseValid && lowercaseValid && numberValid && specialCharValid && matchValid) {
      setPasswordError("");
    }
  }, [passwordInputs]);

  // Determine if all password requirements are met
  const allPasswordRequirementsMet = Object.values(passwordValidationStatus).every(status => status);

  const handlePasswordUpdate = async () => {
    // Check for empty fields first, as these are critical
    const { current, new: newPassword, confirm } = passwordInputs;
    if (!current || !newPassword || !confirm) {
      setPasswordError("Please fill in all fields.");
      return;
    }

    // If not all password requirements are met, display error based on validation status
    if (!allPasswordRequirementsMet) {
      // Find the first unmet requirement and set a specific error message
      if (!passwordValidationStatus.length) setPasswordError("Password must be at least 8 characters long.");
      else if (!passwordValidationStatus.uppercase) setPasswordError("Password must contain an uppercase letter.");
      else if (!passwordValidationStatus.lowercase) setPasswordError("Password must contain a lowercase letter.");
      else if (!passwordValidationStatus.number) setPasswordError("Password must contain a number.");
      else if (!passwordValidationStatus.specialChar) setPasswordError("Password must contain a special character.");
      else if (!passwordValidationStatus.match) setPasswordError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowPasswordModal(false);
      setPasswordInputs({ current: "", new: "", confirm: "" });
      // Using a custom message box instead of alert()
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50';
      messageBox.innerHTML = `
        <div class="bg-[#171717] p-8 rounded-lg shadow-lg text-white text-center">
          <p class="text-xl mb-4">Password updated successfully!</p>
          <button id="closeMessageBox" class="bg-[#9966CC] hover:bg-[#7d56b6] text-white px-6 py-2 rounded-md">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById('closeMessageBox').onclick = () => document.body.removeChild(messageBox);
    }, 1500);
  };

  const sendOtpToEmail = async (targetEmail) => {
    console.log(`Sending OTP to ${targetEmail}...`);
    // Simulate API call
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  };

  const verifyOtp = async (enteredOtp) => {
    const expectedOtp = "123456"; // This should come from your backend
    // Simulate API call
    return new Promise((resolve) => setTimeout(() => resolve(enteredOtp === expectedOtp), 500));
  };

  // This function is now specifically for the "Verify" button under OTP input
  const handleOtpVerification = async () => {
    if (otp.trim() === "") {
      setHighlightEmpty(prev => ({ ...prev, otp: true }));
      setTimeout(() => setHighlightEmpty(prev => ({ ...prev, otp: false })), 2000);
      return;
    }

    setIsVerifyingOtp(true); // Set loading for OTP verification
    const isVerified = await verifyOtp(otp);
    setIsVerifyingOtp(false); // Clear loading

    if (!isVerified) {
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50';
      messageBox.innerHTML = `
        <div class="bg-[#171717] p-8 rounded-lg shadow-lg text-white text-center">
          <p class="text-xl mb-4">Invalid OTP. Please try again.</p>
          <button id="closeMessageBox" class="bg-[#9966CC] hover:bg-[#7d56b6] text-white px-6 py-2 rounded-md">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById('closeMessageBox').onclick = () => document.body.removeChild(messageBox);
      return; // Stay in OTP input state
    } else {
      // OTP verified, show final email change form directly
      setShowOtpInput(false);
      setOtpSent(false); // OTP is verified, no longer "sent" in the pending sense
      setShowFinalEmailChangeForm(true);
      setFormerEmailInput(originalEmail);
      setNewEmailConfirmInput(email); // The new email user typed earlier
    }
  };


  const handleProfileSave = async () => { // This is now for general profile updates, not email change flow
    const empty = {
      fullName: fullName.trim() === "",
      mobileNumber: mobileNumber.trim() === "",
      email: emailInputVisible && email.trim() === "", // Only check if input is visible
    };

    if (empty.fullName || empty.mobileNumber || empty.email) {
      setHighlightEmpty(empty);
      setTimeout(() => {
        setHighlightEmpty({
          fullName: false,
          mobileNumber: false,
          email: false,
        });
      }, 2000);
      return;
    }

    // This part runs if it's a regular profile save (not email change flow)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUpdateProfile(false);
      // Reset email-related states if it was a general profile update
      setShowSendOtpPrompt(false);
      setOtpSent(false);
      setShowOtpInput(false);
      setEmailInputVisible(true); // Ensure email input is visible for next edit
      setNewEmailDisplay("");
      setOriginalEmail(email); // Update original email only after successful save
    }, 2000);
  };

  const handleSendOtpClick = async () => {
    setIsSendingOtp(true); // Set loading for OTP sending
    await sendOtpToEmail(originalEmail); // Send to original email for verification
    setOtpSent(true);
    setShowOtpInput(true); // Show OTP input
    setShowSendOtpPrompt(false); // Hide this prompt
    setIsSendingOtp(false); // Clear loading
  };

  const handleFinalEmailSave = async () => {
    // Basic validation for the two email inputs
    if (!formerEmailInput.trim() || !newEmailConfirmInput.trim()) {
      setPasswordError("Both former and new email fields are required."); // Reusing passwordError state for simplicity
      return;
    }
    if (formerEmailInput.trim() !== originalEmail) {
        setPasswordError("Former email does not match your current email.");
        return;
    }
    if (newEmailConfirmInput.trim() !== email) {
        setPasswordError("New email does not match the email you entered previously.");
        return;
    }


    setIsFinalEmailSaving(true);
    // Simulate API call to update email
    setTimeout(() => {
      setIsFinalEmailSaving(false);
      setOriginalEmail(newEmailConfirmInput); // Update original email to the new one
      setEmail(newEmailConfirmInput); // Update current email state
      setShowFinalEmailChangeForm(false); // Hide the final form
      setUpdateProfile(false); // Exit update profile mode
      setEmailInputVisible(true); // Reset email input visibility
      setNewEmailDisplay(""); // Clear display text
      setOtpSent(false); // Reset OTP states
      setShowOtpInput(false);
      setOtp("");
      setShowSendOtpPrompt(false);
      setFormerEmailInput("");
      setNewEmailConfirmInput("");

      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50';
      messageBox.innerHTML = `
        <div class="bg-[#171717] p-8 rounded-lg shadow-lg text-white text-center">
          <p class="text-xl mb-4">Email updated successfully!</p>
          <button id="closeMessageBox" class="bg-[#9966CC] hover:bg-[#7d56b6] text-white px-6 py-2 rounded-md">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById('closeMessageBox').onclick = () => document.body.removeChild(messageBox);

    }, 1500);
  };

  // Determine if the final email save button should be enabled
  const isFinalEmailSaveEnabled = formerEmailInput.trim() !== "" && newEmailConfirmInput.trim() !== "" && !isFinalEmailSaving;

  // Condition to hide the "Save Changes" button in the header
  const hideHeaderSaveButton = showSendOtpPrompt || showOtpInput || showFinalEmailChangeForm;


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
            className="bg-[#9966CC] h-[70%] rounded-[10px] w-[13%] text-[13px]"
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
                  className="h-[80%] w-[95%] rounded-md  mt-8"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={` w-[100%] h-[55%] flex justify-center items-center`}>
        <div className="h-[95%] w-[97%] flex justify-center items-center">
          <form
            onSubmit={(e) => e.preventDefault()}
            className={`border-2 h-[100%] w-[100%] rounded-[10px] flex flex-col justify-between p-3`}
          >
            <div
              className={`w-[100%] ${
                !updateProfile ? "border-b-2  h-[45%]" : " mt-10"
              } flex flex-col justify-between items-center`}
            >
              <div className="h-[30%] w-[100%] flex justify-between items-center">
                <p className="text-[20px] font-semibold">
                  Personal Information
                </p>
                {updateProfile && !hideHeaderSaveButton ? ( // Hide if email flow is active
                  <button
                    type="button"
                    onClick={handleProfileSave} // Use handleProfileSave for general updates
                    className="flex items-center bg-[#9966CC] hover:bg-[#7d56b6] text-white px-4 py-2 rounded-[10px] transition-colors duration-200"
                  >
                    {isLoading ? (
                      <>
                        <span className="loader mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes
                      </>
                    )}
                  </button>
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
                <div className="w-[100%] h-[55%] flex items-start flex-col gap-1">
                  <p className="text-[16px] mb-2">Role</p>
                  <p>Super Admin</p>
                </div>
              )}
            </div>

            <div className="w-[100%] h-[25%] flex flex-col justify-center items-start gap-1">
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

      <div className=" w-[100%] flex justify-center items-center mt-8">
        <div className="h-[95%] w-[97%] flex justify-center flex-col border-2 rounded-[10px]">
          <div className="h-[30%] w-[100%] flex justify-between items-center p-3 mt-3">
            <p className="text-[20px] font-semibold w-[20%]">Contact Information</p>

            {/* This "Save Changes" button is now hidden if the email change flow is active */}
            {updateProfile && !hideHeaderSaveButton ? (
              <button
                type="button"
                onClick={handleProfileSave}
                className={`flex items-center px-4 py-2 rounded-[10px] transition-colors duration-200 ${
                    isLoading
                    ? "bg-[#8B8B8B] text-gray-400 cursor-not-allowed"
                    : "bg-[#9966CC] hover:bg-[#7d56b6] text-white"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loader mr-2"></span>
                    Saving...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </button>
            ) : (
              // This is the "Edit" button for the Contact Information section
              <button
                type="button"
                onClick={() => {
                  setUpdateProfile(true);
                  // Reset email flow states when entering edit mode if not already in an email flow
                  if (!showSendOtpPrompt && !showOtpInput && !showFinalEmailChangeForm) {
                    setEmailInputVisible(true);
                    setNewEmailDisplay("");
                    setOtpSent(false);
                    setShowOtpInput(false);
                    setOtp("");
                  }
                }}
                className="flex items-center text-[17px] text-[#9966CC]"
              >
                <MdOutlineEdit className="mr-1" />
                Edit
              </button>
            )}
          </div>
          <div className="w-[100%] h-[%] flex items-start flex-col gap-1 p-3" >
            <p className="text-[16px]"> Email Address</p>
            {updateProfile ? (
              <>
                {/* State 1: Initial email input is visible (user can type) */}
                {emailInputVisible && !showSendOtpPrompt && !showOtpInput && !showFinalEmailChangeForm && (
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      const newEmail = e.target.value;
                      setEmail(newEmail);
                      // Only trigger the next step if email is different AND contains @gmail.com
                      if (newEmail !== originalEmail && newEmail.includes('@gmail.com')) {
                        setEmailInputVisible(false); // Hide the input field
                        setNewEmailDisplay(newEmail); // Set the new email to be displayed as text
                        setShowSendOtpPrompt(true); // Show the "To proceed..." message and button
                        setOtpSent(false); // Reset OTP states
                        setShowOtpInput(false);
                        setOtp("");
                        setShowFinalEmailChangeForm(false);
                      } else {
                        // If user types back the original email, or email doesn't contain @gmail.com, keep input visible
                        setEmailInputVisible(true);
                        setNewEmailDisplay(""); // Clear display text
                        setShowSendOtpPrompt(false); // Hide prompt
                        setOtpSent(false);
                        setShowOtpInput(false);
                        setOtp("");
                        setShowFinalEmailChangeForm(false);
                      }
                    }}
                    className={`rounded px-2 py-1 w-full bg-[#171717] text-white h-[60px] outline-none ${
                      highlightEmpty.email
                        ? "border-2 border-[#9966CC]"
                        : "border border-[#333]"
                    }`}
                  />
                )}

                {/* State 2: New email displayed as text, showing prompt to send OTP */}
                {!emailInputVisible && newEmailDisplay && showSendOtpPrompt && !otpSent && !showOtpInput && !showFinalEmailChangeForm && (
                  <div className="w-full mt-3 space-y-2">
                    <p className="text-[16px]">{newEmailDisplay}</p> {/* Display new email as text */}
                    <p className="text-sm text-white">
                      To proceed, please click the button below to send a verification code to your current email address.
                    </p>
                    <button
                      type="button"
                      onClick={handleSendOtpClick}
                      className="bg-[#9966CC] hover:bg-[#7d56b6] text-white px-4 py-2 rounded-[10px] transition-colors duration-200"
                      disabled={isSendingOtp}
                    >
                      {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </div>
                )}

                {/* State 3: OTP sent, awaiting OTP input AND "Verify" button */}
                {showOtpInput && otpSent && !showFinalEmailChangeForm && (
                  <div className="w-full mt-3 space-y-2">
                    <p className="text-[16px]">{newEmailDisplay}</p> {/* Still display new email as text */}
                    <p className="text-sm text-white">
                      A 4-digit verification code has been sent to{" "}
                      <span className="font-semibold">{originalEmail}</span>.
                      Please enter the code below to continue.
                    </p>
                    <div className="flex items-center gap-2"> {/* Flex container for input and button */}
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className={`rounded px-2 py-1 flex-grow bg-[#171717] text-white h-[60px] outline-none ${
                                highlightEmpty.otp
                                ? "border-2 border-[#9966CC]"
                                : "border border-[#333]"
                            }`}
                        />
                        {/* NEW: Verify button beside OTP input */}
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
                            {isVerifyingOtp ? (
                                <>
                                <span className="loader mr-2"></span>
                                Verifying...
                                </>
                            ) : (
                                <>Verify</>
                            )}
                        </button>
                    </div>
                  </div>
                )}

                {/* State 4: OTP verified, showing final email change form */}
                {showFinalEmailChangeForm && (
                    <div className="w-full mt-3 space-y-4">
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
                        {/* NEW: Save New Email button under the last input */}
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
              </>
            ) : (
              // When not in update profile mode, just show the email text
              <p>{email}</p>
            )}
          </div>
        </div>
      </div>
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-[#171717] mt-10 rounded-lg w-[33%] h-[90%]  flex justify-center items-center flex-col ">
            <div className="flex justify-between items-center mb-4 border-b-2 p-4 w-[100%]">
              <h2 className="text-white text-xl font-semibold">
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
                  <span>Contains at least one special character (!@#$%^&*)</span>
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

              <div className="flex gap-4 items-center justify-end mt-4 border-t-2 pt-2 h-[15%]">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordInputs({ current: "", new: "", confirm: "" });
                    setPasswordError("");
                    setShowPasswordModal(false);
                  }}
                  className="flex items-center border border-[#9966CC] text-[#9966CC] px-4 py-2 rounded-[10px] transition-colors duration-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  disabled={!allPasswordRequirementsMet || isLoading} // Disable button if requirements not met or loading
                  className={`flex items-center px-4 py-2 rounded-[10px] transition-colors duration-200 ${
                    allPasswordRequirementsMet && !isLoading
                      ? "bg-[#9966CC] hover:bg-[#7d56b6] text-white" // Enabled style
                      : "bg-[#8B8B8B] text-gray-400 cursor-not-allowed" // Disabled style
                  }`}
                >
                  {isLoading ? (
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