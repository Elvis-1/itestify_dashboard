import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { CheckCircleFilled, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icons/Logo.png";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password1, setPassword1] = useState("");
  const [loading, setLoading] = useState(false);

  const validations = {
    length: password1.length >= 8,
    number: /\d/.test(password1),
    uppercase: /[A-Z]/.test(password1),
    lowercase: /[a-z]/.test(password1),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password1),
  };

  const onFinish = async () => {
    let regEx =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).{8,}$/;
    if (!regEx.test(password1)) {
      message.error("Invalid credentials");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `https://itestify-backend-38u1.onrender.com/auths/reset-password/`,
        {
          uid,
          token,
          password: password1,
        },
      );

      const user = JSON.parse(localStorage.getItem("user"));
      user.created_password = true;
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
      message.success(
        "Password Reset successfully, use this password when next you want to log In"
      );
    } catch (error) {
      message.error("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const allValidations =
    validations.length &&
    validations.number &&
    validations.uppercase &&
    validations.lowercase &&
    validations.specialChar;

  return (
    <div className="flex justify-center flex-col items-center min-h-screen bg-black">
      <img className="w-12" src={logo} alt="logo" />
      <div className="w-[500px]">
        <div className="text-white w-[80%] m-[auto] mt-6">
          <h1 className="font-sans text-white text-center text-xl font-bold">
            Create a New Password
          </h1>
        </div>

        <Form onFinish={onFinish} layout="vertical">
          <div className="w-[80%] m-[auto] mt-3">
            <label className="text-white pl-1 font-sans">Password</label>
            <Form.Item>
              <Input.Password
                name="newPassword"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="border-none outline-none mt-2"
                placeholder="Enter Password"
                prefix={<LockOutlined className="text-white" />}
                style={{ backgroundColor: "#313131", color: "white" }}
              />
            </Form.Item>
            <div className="text-white text-[12px] mt-[-10px] opacity-[0.7]">
              <ul>
                <li className="flex items-center gap-2 pb-2 capitalize">
                  {validations.length ? (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#9966CC" }}
                    />
                  ) : (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#FFFFFF80" }}
                    />
                  )}
                  Password must be atleast 8 characters
                </li>
                <li className="flex items-center gap-2 pb-2 capitalize">
                  {validations.uppercase ? (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#9966CC" }}
                    />
                  ) : (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#FFFFFF80" }}
                    />
                  )}
                  Atleast one uppercase letter
                </li>
                <li className="flex items-center gap-2 pb-2 capitalize">
                  {validations.lowercase ? (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#9966CC" }}
                    />
                  ) : (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#FFFFFF80" }}
                    />
                  )}
                  Atleast one lowercase letter
                </li>
                <li className="flex items-center gap-2 pb-2 capitalize">
                  {validations.number ? (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#9966CC" }}
                    />
                  ) : (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#FFFFFF80" }}
                    />
                  )}
                  Atleast one number
                </li>
                <li className="flex items-center gap-2 pb-2 capitalize">
                  {validations.specialChar ? (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#9966CC" }}
                    />
                  ) : (
                    <CheckCircleFilled
                      style={{ fontSize: "15px", color: "#FFFFFF80" }}
                    />
                  )}
                  Atleast one special character
                </li>
              </ul>
            </div>

            <Form.Item style={{ marginTop: "30px" }}>
              <Button
                block
                htmlType="submit"
                className={`${
                  allValidations
                    ? `bg-primary hover:!bg-primary-light-mode hover:!text-white`
                    : `bg-[#FFFFFF80] cursor-not-allowed hover:!bg-[#FFFFFF80] hover:!text-white`
                } text-white text-[13px] outline-none border-none
                  
                transition-colors duration-200 ease-in-out p-2`}
                loading={loading}
              >
                Continue
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
