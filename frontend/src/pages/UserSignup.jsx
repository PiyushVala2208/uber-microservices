import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      newUser,
    );

    if (response.status === 201) {
      const data = response.data;
      setUserData(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }

    setEmail("");
    setFirstName("");
    setLastName("");
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

        {/* Signup Form */}
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="w-full flex flex-col"
        >
          {/* Full Name Fields */}
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2 tracking-tight">
              What's your name
            </h3>
            <div className="flex gap-4 w-full">
              <input
                required
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-1/2 text-base outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
              />
              <input
                required
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-1/2 text-base outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2 tracking-tight">
              What's your email
            </h3>
            <input
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-full text-base outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-2 tracking-tight">
              Enter Password
            </h3>
            <input
              required
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-full text-base outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Create Account Button */}
          <button className="bg-black text-white font-semibold rounded-xl py-3.5 w-full text-base tracking-wide shadow-md active:scale-[0.99] transition-transform duration-100">
            Create account
          </button>
        </form>

        {/* Login Redirect Link */}
        <p className="text-center text-sm font-medium text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-black font-bold underline underline-offset-4"
          >
            Login here
          </Link>
        </p>
      </div>

      {/* Bottom Section: Legal Disclaimers */}
      <div className="w-full pb-4">
        <p className="text-[11px] text-gray-400 leading-normal tracking-wide text-center">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline text-gray-600 cursor-pointer">
            Google Privacy Policy
          </span>{" "}
          and{" "}
          <span className="underline text-gray-600 cursor-pointer">
            Terms of Service apply
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
