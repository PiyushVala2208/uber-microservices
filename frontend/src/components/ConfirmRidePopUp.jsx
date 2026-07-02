import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHander = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride?._id,
            otp: otp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate("/captain-riding", { state: { ride: props.ride } });
      }
    } catch (error) {
      console.error("Verification failed for transaction parameters:", error);
    }
  };

  return (
    <div className="w-full bg-white flex flex-col justify-end select-none relative pb-2">
      <h5
        className="absolute top-2 right-2 p-2 cursor-pointer text-zinc-400 hover:text-zinc-800 transition-colors  hover:bg-zinc-100 rounded-full w-8 h-8 flex items-center justify-center active:scale-90 z-30"
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
      >
        <i className="text-2xl ri-close-line"></i>
      </h5>

      <div className="flex flex-col mt-2">
        <div className="flex items-center gap-1.5">
          <i className="ri-shield-check-fill text-zinc-900 text-xs animate-pulse"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Security Gateway Authorization
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mt-0.5">
          Verify OTP to Start Journey
        </h3>
      </div>

      <div className="w-auto  h-1 bg-zinc-100 rounded-full overflow-hidden mt-3 relative">
        <style>{`
            @keyframes modernShimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `}</style>
        <div
          className="absolute top-0 left-0 h-full w-1/2 bg-zinc-900 rounded-full"
          style={{
            animation:
              "modernShimmer 1.4s infinite cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        ></div>
      </div>

      <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl mt-4 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <img
            className="h-11 w-11 rounded-full object-cover border border-zinc-200 shadow-xs shrink-0"
            src={
              props.ride?.user?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtgSnyw7CN3F5S3Ox-FU5wjh0YeyqN3L9eUviQUJ1kj5SCzt8uNqL-KRNBlwh0dOVYofHNeZicv0_lKn75Rmbm5Z51EQvtKVRKb6Qxb4ObRQ&s=10"
            }
            alt="Verified User Avatar"
          />
          <div className="min-w-0 flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Assigned Client
            </span>
            <h2 className="text-base font-black text-zinc-800 truncate capitalize mt-0.5">
              {props.ride?.user?.fullname
                ? `${props.ride.user.fullname.firstname} ${props.ride.user.fullname.lastname}`
                : "Premium Passenger"}
            </h2>
          </div>
        </div>

        <div className="bg-zinc-950 text-white px-3 py-1.5 rounded-xl font-mono text-xs font-bold tracking-tight text-center shrink-0 shadow-sm">
          2.2 KM{" "}
          <span className="text-[9px] block font-sans font-medium text-zinc-400 tracking-normal lowercase -mt-0.5">
            trip scale
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4 w-full">
        <div className="w-full space-y-1">
          <div className="flex items-start gap-4 p-3 hover:bg-zinc-50/40 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center shadow-xs border border-zinc-200/50">
              <i className="ri-map-pin-user-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Departure Terminal
              </h4>
              <p className="text-sm font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="w-full px-7.5 -my-1">
            <div className="w-[2px] h-4 border-l-2 border-dashed border-zinc-200"></div>
          </div>

          <div className="flex items-start gap-4 p-3 hover:bg-zinc-50/40 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <i className="ri-map-pin-2-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Arrival Destination
              </h4>
              <p className="text-sm font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          <div className="w-full px-7.5 -my-1">
            <div className="w-[2px] h-4 border-l-2 border-dashed border-zinc-200"></div>
          </div>

          <div className="flex items-start gap-4 p-3 hover:bg-zinc-50/40 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs border border-emerald-100">
              <i className="ri-wallet-3-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Guaranteed Settlement
              </h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-extrabold text-zinc-900">
                  ₹{props.ride?.fare}
                </span>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                  Cash Remittance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full">
        <form onSubmit={submitHander} className="flex flex-col gap-3">
          <div className="relative w-full">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className="bg-zinc-100 border border-zinc-200/60 font-mono text-xl font-bold tracking-[0.4em] text-center text-zinc-900 rounded-2xl w-full py-4 px-6 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:text-zinc-400 placeholder:font-medium focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none transition-all"
              placeholder="Enter 4 or 6-digit Secure Passcode"
            />
            <i className="ri-key-2-line absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg pointer-events-none"></i>
          </div>

          <div className="mt-2 w-full flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold tracking-wide py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 transition-all cursor-pointer text-sm sm:text-base order-1 sm:order-2"
            >
              <i className="ri-play-circle-fill text-lg"></i>
              Initialize & Start Ride
            </button>

            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="w-full bg-zinc-100 hover:bg-zinc-200 active:scale-[0.99] text-zinc-700 font-bold tracking-wide py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm sm:text-base order-2 sm:order-1"
            >
              Abort Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
