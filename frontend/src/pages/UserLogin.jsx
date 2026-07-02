import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});

  const { user, setUser } = useContext(UserDataContext);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      userData,
    );

    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="w-full h-dvh min-h-dvh bg-white flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none">
      <div className="w-full flex flex-col">
        <div className="pt-4 pb-5 flex items-center justify-between w-full">
          <img
            src="/uber.png"
            alt="Uber Logo"
            className="w-20 sm:w-24 object-contain"
          />
          <div className="flex items-center gap-2 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
            User
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="w-full flex flex-col"
        >
          {/* Email Field */}
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2 tracking-tight">
              What's your email
            </h3>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-full text-base outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-2 tracking-tight">
              Enter Password
            </h3>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-full text-base outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Login Button */}
          <button className="bg-black text-white font-semibold rounded-xl py-3.5 w-full text-base tracking-wide shadow-md active:scale-[0.99] transition-transform duration-100">
            Login
          </button>
        </form>

        {/* Register Redirect Link */}
        <p className="text-center text-sm font-medium text-gray-500 mt-5">
          New here?{" "}
          <Link
            to="/signup"
            className="text-black font-bold underline underline-offset-4"
          >
            Create new Account
          </Link>
        </p>
      </div>

      {/* Captain Login Button */}
      <div className="w-full pb-4">
        <Link
          to="/captain-login"
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold rounded-xl py-3.5 w-full text-base tracking-wide shadow-sm hover:bg-[#0e9f55] active:scale-[0.99] transition-all duration-100"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
