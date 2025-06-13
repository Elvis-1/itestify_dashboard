import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { CheckCircleFilled, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/icons/Logo.png";
import axios from "axios";

const CheckMail = () => {
  return (
    <div className="flex justify-center flex-col items-center min-h-screen bg-black">
      <img className="w-12" src={logo} alt="logo" />
      <div className="w-[500px]">
        <div className="text-white w-[80%] m-[auto] mt-6">
          <h1 className="font-sans text-white text-center text-xl font-bold">
            Check Your Email
          </h1>
        </div>

        <Form layout="vertical">
          <div className="w-[80%] m-[auto] mt-3">
            <div className="text-[#FFFFFF] text-[12px] mt-[-10px] opacity-[0.7]">
              <ul className="pl-2">
                <li className="list-disc pt-2 pl-1">
                  We&aposve;ve sent a password reset link to email address.{" "}
                </li>
                <li className="list-disc pt-2 pl-1">
                  The link will expire in 30 minutes.
                </li>
                <li className="list-disc pt-2 pl-1">
                  If you didn’t receive the email? Check your spam folder or
                  request a new link.
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center ">
              <Form.Item style={{ marginTop: "30px" }}>
                <Button
                  block
                  htmlType="submit"
                  className="
                  bg-primary hover:!bg-primary-light-mode hover:!text-white
                 text-white text-[13px] outline-none border-none
                transition-colors duration-200 ease-in-out p-4"
                >
                  Resend Link
                </Button>
              </Form.Item>
              <Link to="/login" className="text-primary w-full text-center">
                Back to Login
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CheckMail;
