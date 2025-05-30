import React from "react";
import { Form, Input, Button, message } from "antd";
import logo from "../assets/icons/Logo.png";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const email = values.email;
      const response = await axios.post(
        "https://itestify-backend-nxel.onrender.com/auths/forgot-password/",
        {
          email: email,
        }
      );
      message.success(response.data.message);
      navigate("/check-email/");
    } catch (error) {
      message.error(
        error?.response?.data?.message,
        "Failed to send password reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0B0B0B]">
      <div className="flex flex-col w-[350px]">
        <div className="flex justify-center items-center flex-col">
          <img className="w-[50px]" src={logo} alt="" />
          <p className="font-sans text-white text-center pt-2">
            Reset Password
          </p>
          <p className="font-sans text-white text-center text-xs opacity-70">
            Enter email address assciated with account
          </p>
        </div>
        <div className="pt-5">
          <Form onFinish={onFinish} layout="vertical">
            <label className="text-white pl-1 ">Email Address</label>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "email is reqiured" }]}
            >
              <Input
                id="email"
                placeholder="Enter Email Address"
                className="border-none outline-none"
                prefix={<MailOutlined className="text-white" />}
                style={{
                  backgroundColor: "#313131",
                  color: "white",
                  marginTop: "6px",
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                block
                htmlType="submit"
                className="bg-primary text-white text-[13px] outline-none border-none py-4 mt-4"
                loading={isLoading}
              >
                Send Password Reset Link
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
