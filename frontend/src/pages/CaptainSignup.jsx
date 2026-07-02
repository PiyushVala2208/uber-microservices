import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CapatainContext";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      captainData,
    );

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }

    // Form states cleaning logic
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="w-full h-dvh min-h-dvh bg-white flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none">
      <div className="w-full flex flex-col flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="pt-4 pb-5 flex items-center justify-between w-full shrink-0">
          <img
            src="/uberCaptain.png"
            alt="Uber Logo"
            className="w-20 sm:w-24 object-contain"
          />
          <div className="flex items-center gap-2 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
            Captain
          </div>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="w-full flex flex-col"
        >
          {/* Captain Name Fields */}
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2 tracking-tight">
              What's our Captain's name
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
              What's our Captain's email
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
          <div className="mb-5">
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

          {/* Vehicle Information Fields */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-2 tracking-tight">
              Vehicle Information
            </h3>

            {/* Row 1: Color & Plate */}
            <div className="flex gap-4 mb-4 w-full">
              <input
                required
                type="text"
                placeholder="Vehicle Color"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-1/2 text-base outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
              />
              <input
                required
                type="text"
                placeholder="Vehicle Plate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-1/2 text-base outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
              />
            </div>

            {/* Row 2: Capacity & Type */}
            <div className="flex gap-4 w-full">
              <input
                required
                type="number"
                placeholder="Vehicle Capacity"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-1/2 text-base outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
              />
              <div className="relative w-1/2">
                <select
                  required
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="bg-[#f6f6f6] rounded-xl px-4 py-3.5 border border-transparent focus:border-black focus:bg-white w-full text-base outline-none transition-all duration-200 text-gray-800 font-medium appearance-none cursor-pointer pr-8"
                >
                  <option value="" disabled className="text-gray-400">
                    Select Type
                  </option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="moto">Moto</option>
                </select>
                {/* Custom Elegant Dropdown Mini Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Create Captain Button */}
          <button className="bg-black text-white font-semibold rounded-xl py-3.5 w-full text-base tracking-wide shadow-md active:scale-[0.99] transition-transform duration-100 shrink-0">
            Create Captain Account
          </button>
        </form>

        {/* Redirect Link */}
        <p className="text-center text-sm font-medium text-gray-500 mt-5 mb-6 shrink-0">
          Already have an account?{" "}
          <Link
            to="/captain-login"
            className="text-black font-bold underline underline-offset-4"
          >
            Login here
          </Link>
        </p>
      </div>

      {/* Bottom Section: Legal Disclaimers */}
      <div className="w-full pb-4 pt-2 bg-white shrink-0">
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

export default CaptainSignup;
