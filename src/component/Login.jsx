// import React from "react";
// import { Form, Input, Button } from "antd";
// import logo from "../assets/icons/Logo.png";
// import { MailOutlined, LockOutlined } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate()
//   const onFinish = (values) => {
//     console.log({ values });
//     navigate("/dashboard/");
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#0B0B0B]">
//       <div className="flex flex-col w-[350px]">
//         <div className="flex justify-center items-center flex-col">
//           <img className="w-[50px]" src={logo} alt="" />
//           <p className="font-sans text-white text-center pt-2">
//             Welcome Back, Admin!
//           </p>
//         </div>
//         <div>
//           <Form onFinish={onFinish} layout="vertical">
//             <label className="text-white pl-1">Email Address</label>
//             <Form.Item
//               name="email"
//               rules={[{ required: true, message: "email is reqiured" }]}
//             >
//               <Input
//                 id="email"
//                 placeholder="Enter Email Address"
//                 className="border-none outline-none"
//                 prefix={<MailOutlined className="text-white" />}
//                 style={{ backgroundColor: "#313131", color: "white" }}
//               />
//             </Form.Item>

//             <label className="text-white pl-1">Password</label>
//             <Form.Item
//               name="password"
//               rules={[{ required: true}]}
//             >
//               <Input.Password
//                 id="password"
//                 className="border-none outline-none"
//                 placeholder="Enter password"
//                 prefix={<LockOutlined className="text-white" />}
//                 style={{ backgroundColor: "#313131", color: "white" }}
//               />
//             </Form.Item>
//             <div className="flex w-full items-center justify-between text-xs">
//               <div className="flex items-center gap-1 text-white">
//                 <input type="checkbox" name="" id="" />
//                 <p>Remember me</p>
//               </div>
//               <Link to="/forgot-password">
//                 <a className="text-primary" href="">
//                   Forgot Password
//                 </a>
//               </Link>
//             </div>
//             <Form.Item >
//               <Button
//                 block
//                 htmlType="submit"
//                 className="bg-[#9966CC] text-white text-[13px] outline-none border-none py-4 mt-4"
//               >
//                 Login
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import logo from "../assets/icons/Logo.png";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true)
      
      const response = await axios.post(
        "https://itestify-backend-nxel.onrender.com/login/password/",
        {
          email: values.email,
          password: values.password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
      message.success("Login successful!");

    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      message.error("Login failed. Please check your credentials.");
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0B0B0B]">
      <div className="flex flex-col w-[350px]">
        <div className="flex justify-center items-center flex-col">
          <img className="w-[50px]" src={logo} alt="" />
          <p className="font-sans text-white text-center pt-2">
            Welcome Back, Admin!
          </p>
        </div>
        <div>
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

            <label className="text-white pl-1">Password</label>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                id="password"
                className="border-none outline-none"
                placeholder="Enter password"
                prefix={<LockOutlined className="text-white" />}
                style={{ backgroundColor: "#313131", color: "white" }}
              />
            </Form.Item>
            <div className="flex w-full items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-white">
                <input type="checkbox" name="" id="" />
                <p>Remember me</p>
              </div>
              <Link to="/forgot-password">
                <a className="text-primary" href="">
                  Forgot Password
                </a>
              </Link>
            </div>
            <Form.Item>
              <Button
                block
                htmlType="submit"
                className="bg-[#9966CC] text-white text-[13px] outline-none border-none py-4 mt-4"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
