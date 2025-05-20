import React, { useState, useEffect } from "react";
import { Form, Input, Button, Spin } from "antd";
import {
  LockOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import logo from "../assets/Logo.png";

const AdminLoginInvite = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract email from URL parameters when component mounts
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  const checkPasswordValidation = (password, confirmPassword) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%]/.test(password),
      match: password === confirmPassword && password !== "",
    });
  };

  const [isTyping, setIsTyping] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Use the email from URL and password from form
      const response = await axios.post(
        "https://itestify-backend-nxel.onrender.com/admin/setup-account/",
        {
          email: email,
          password: values.password,
        }
      );

      // Success animation
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "Account setup failed:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0B0B0B]">
        <div className="flex flex-col items-center">
          <div className="w-[50px] h-[50px] bg-[#9966CC] rounded-full animate-pulse"></div>
          <div className="h-6 w-48 bg-white mt-4 animate-pulse rounded"></div>
          <div className="h-4 w-64 bg-gray-700 mt-2 animate-pulse rounded"></div>
          <div className="h-4 w-56 bg-gray-700 mt-1 animate-pulse rounded"></div>
          <div className="w-[350px] h-10 bg-gray-700 mt-6 animate-pulse rounded"></div>
          <div className="w-[350px] h-10 bg-gray-700 mt-4 animate-pulse rounded"></div>
          <div className="w-[350px] h-10 bg-gray-700 mt-4 animate-pulse rounded"></div>
          <div className="w-[350px] h-12 bg-gray-700 mt-8 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-[#0B0B0B]"
    >
      <div className="flex flex-col w-[350px]">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="flex justify-center items-center flex-col"
        >
          <div className="w-[50px] h-[50px] bg-[#9966CC] rounded-full flex justify-center items-center pb-2">
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              src={logo}
              alt="Logo"
              style={{ width: 48, height: 48 }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-sans text-white text-center pt-2 text-xl"
          >
            Welcome to iTestified
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-sans text-white text-center text-sm opacity-80 my-3"
          >
            You have been invited to join the iTestified Admin team,
            <br />
            Please create a password to access your dashboard
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <div className="mb-6">
            <label className="text-white pl-1 block mb-2 text-sm">
              Email Address
            </label>
            <p className="text-white bg-[#313131] text-sm">{email}</p>
          </div>

          <Form onFinish={onFinish} layout="vertical">
            <div className="mb-4">
              <label className="text-white pl-1 block mb-2">New Password</label>
              <Form.Item
                name="password"
                className="mb-0"
                rules={[
                  {
                    required: true,
                    message: "Please enter a password",
                  },
                ]}
              >
                <Input.Password
                  id="password"
                  className="border-none outline-none"
                  placeholder="Enter Password"
                  prefix={<LockOutlined className="text-white" />}
                  style={{
                    backgroundColor: "#313131",
                    color: "white",
                    border: "none",
                  }}
                  onChange={(e) => {
                    const form = document.querySelector("form");
                    const confirmPassword =
                      form.querySelector("#confirmPassword")?.value || "";
                    setIsTyping(true); // Track typing
                    checkPasswordValidation(e.target.value, confirmPassword);
                  }}
                />
              </Form.Item>
            </div>

            <div className="mb-4">
              <label className="text-white pl-1 block mb-2">
                Confirm New Password
              </label>
              <Form.Item
                name="confirmPassword"
                className="mb-0"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password",
                  },
                ]}
              >
                <Input.Password
                  id="confirmPassword"
                  className="border-none outline-none"
                  placeholder="Confirm Password"
                  prefix={<LockOutlined className="text-white" />}
                  style={{
                    backgroundColor: "#313131",
                    color: "white",
                    border: "none",
                  }}
                  onChange={(e) => {
                    const form = document.querySelector("form");
                    const password =
                      form.querySelector("#password")?.value || "";
                    setIsTyping(true); // Track typing
                    checkPasswordValidation(password, e.target.value);
                  }}
                />
              </Form.Item>
            </div>
            {/* password check validation */}
            <div className="text-white text-xs mt-2">
              <ul className="list-none">
                <motion.li
                  className="flex flex-row-reverse justify-between items-center gap-2 mb-1"
                  animate={{
                    color: passwordValidation.length ? "#4ade80" : "#ffffff",
                  }}
                >
                  {isTyping ? (
                    passwordValidation.length ? (
                      <CheckCircleFilled style={{ color: "#4ade80" }} />
                    ) : (
                      <CloseCircleFilled style={{ color: "#f87171" }} />
                    )
                  ) : (
                    <CheckCircleFilled style={{ color: "#ffffff" }} />
                  )}
                  • Password must be at least 8 characters
                </motion.li>
                <motion.li
                  className="flex flex-row-reverse justify-between items-center gap-2 mb-1"
                  animate={{
                    color: passwordValidation.uppercase ? "#4ade80" : "#ffffff",
                  }}
                >
                  {isTyping ? (
                    passwordValidation.uppercase ? (
                      <CheckCircleFilled style={{ color: "#4ade80" }} />
                    ) : (
                      <CloseCircleFilled style={{ color: "#f87171" }} />
                    )
                  ) : (
                    <CheckCircleFilled style={{ color: "#ffffff" }} />
                  )}
                  • At least one uppercase letter
                </motion.li>
                <motion.li
                  className="flex flex-row-reverse justify-between items-center gap-2 mb-1"
                  animate={{
                    color: passwordValidation.lowercase ? "#4ade80" : "#ffffff",
                  }}
                >
                  {isTyping ? (
                    passwordValidation.lowercase ? (
                      <CheckCircleFilled style={{ color: "#4ade80" }} />
                    ) : (
                      <CloseCircleFilled style={{ color: "#f87171" }} />
                    )
                  ) : (
                    <CheckCircleFilled style={{ color: "#ffffff" }} />
                  )}
                  • At least one lowercase letter
                </motion.li>
                <motion.li
                  className="flex flex-row-reverse justify-between items-center gap-2 mb-1"
                  animate={{
                    color: passwordValidation.number ? "#4ade80" : "#ffffff",
                  }}
                >
                  {isTyping ? (
                    passwordValidation.number ? (
                      <CheckCircleFilled style={{ color: "#4ade80" }} />
                    ) : (
                      <CloseCircleFilled style={{ color: "#f87171" }} />
                    )
                  ) : (
                    <CheckCircleFilled style={{ color: "#ffffff" }} />
                  )}
                  • At least one number
                </motion.li>
                <motion.li
                  className="flex flex-row-reverse justify-between items-center gap-2 mb-1"
                  animate={{
                    color: passwordValidation.special ? "#4ade80" : "#ffffff",
                  }}
                >
                  {isTyping ? (
                    passwordValidation.special ? (
                      <CheckCircleFilled style={{ color: "#4ade80" }} />
                    ) : (
                      <CloseCircleFilled style={{ color: "#f87171" }} />
                    )
                  ) : (
                    <CheckCircleFilled style={{ color: "#ffffff" }} />
                  )}
                  • At least one special character (!@#$%)
                </motion.li>
                <motion.li
                  className="flex flex-row-reverse justify-between items-center gap-2 mb-1"
                  animate={{
                    color: passwordValidation.match ? "#4ade80" : "#ffffff",
                  }}
                >
                  {isTyping ? (
                    passwordValidation.match ? (
                      <CheckCircleFilled style={{ color: "#4ade80" }} />
                    ) : (
                      <CloseCircleFilled style={{ color: "#f87171" }} />
                    )
                  ) : (
                    <CheckCircleFilled style={{ color: "#ffffff" }} />
                  )}
                  • Passwords match
                </motion.li>
              </ul>
            </div>

            <Form.Item className="mt-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  block
                  htmlType="submit"
                  className="text-white text-[20px] outline-none h-12 flex items-center justify-center mt-8"
                  disabled={loading}
                  style={{
                    backgroundColor: "#9966CC",
                    border: "none",
                    color: "white",
                  }}
                >
                  {loading ? <Spin /> : "Create Password"}
                </Button>
              </motion.div>
            </Form.Item>
          </Form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminLoginInvite;