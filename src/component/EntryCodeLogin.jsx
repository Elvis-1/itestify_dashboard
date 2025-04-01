import React, { useState } from "react";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../assets/icons/Logo.png";
import "../App.css";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EntryCodeLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://itestify-backend-nxel.onrender.com/login/entry_code/",
        {
          email: values.email,
          entry_code: values.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      response.data.user.created_password = false

      if (response.data.user.created_password === false) {
        navigate("/create-password");
      } else {
        navigate("/dashboard");
      }

      message.success("Login successful!");

    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        message.error(error.response.data.message || "Invalid email or entry code. Please try again.");
      } else if (error.request) {
        console.error("Request:", error.request);
        message.error("No response received from the server. Please try again.");
      } else {
        console.error("Error message:", error.message);
        message.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[250px] h-[320px]">
      <div className="w-[50%] m-[auto] mt-4 pt-3 mb-3">
        <img className="w-[50px] m-[auto]" src={logo} alt="" />
        <p className="font-sans text-white text-center pt-2">Welcome!</p>
      </div>

      <Form onFinish={onFinish} layout="vertical">
        <label className="text-white pl-1">Email Address</label>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <Input
            id="email"
            placeholder="Enter Email Address"
            className="border-none outline-none"
            prefix={<MailOutlined className="text-white" />}
            style={{ backgroundColor: "#313131", color: "white" }}
          />
        </Form.Item>

        <label className="text-white pl-1">Entry Code</label>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Entry code is required" }]}
        >
          <Input.Password
            id="password"
            className="border-none outline-none"
            placeholder="Enter code"
            prefix={<LockOutlined className="text-white" />}
            style={{ backgroundColor: "#313131", color: "white" }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: "30px" }}>
          <Button
            block
            htmlType="submit"
            className="bg-[#9966CC] text-white text-[13px] outline-none border-none"
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EntryCodeLogin;