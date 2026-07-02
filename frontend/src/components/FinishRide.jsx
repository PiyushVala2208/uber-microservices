import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FinishRide = (props) => {
  const navigate = useNavigate();

  const endRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        {
          rideId: props.ride?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200) {
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Error finalizing transaction parameters:", error);
    }
  };

  return (
    <div className="w-full bg-white select-none ">
      <div
        className="w-full flex justify-center pb-4 cursor-pointer"
        onClick={(e) => {
          props.setFinishRidePanel(false);
        }}
      >
        <i className="text-3xl text-zinc-500  ri-arrow-down-wide-line transition-all duration-200"></i>
      </div>

      <div className="flex flex-col mb-5">
        <div className="flex items-center gap-1.5">
          <i className="ri-flag-2-fill text-zinc-900 text-xs"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Journey Termination Hub
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mt-0.5">
          Finish This Ride
        </h3>
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            className="h-11 w-11 rounded-full object-cover border-2 border-white shadow-md shrink-0"
            src={
              props.ride?.user?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtgSnyw7CN3F5S3Ox-FU5wjh0YeyqN3L9eUviQUJ1kj5SCzt8uNqL-KRNBlwh0dOVYofHNeZicv0_lKn75Rmbm5Z51EQvtKVRKb6Qxb4ObRQ&s=10"
            }
            alt="User Account Avatar"
          />
          <div className="min-w-0 flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Account Rider
            </span>
            <h2 className="text-base font-black text-zinc-800 truncate capitalize mt-0.5">
              {props.ride?.user?.fullname
                ? `${props.ride.user.fullname.firstname} ${props.ride.user.fullname.lastname || ""}`
                : "Premium Rider"}
            </h2>
          </div>
        </div>

        <div className="bg-zinc-900 text-white px-3 py-1.5 rounded-xl font-mono text-xs font-bold tracking-tight shrink-0 shadow-xs">
          {props.ride?.distance || "2.2"} KM
        </div>
      </div>

      <div className="flex flex-col items-center mt-4 w-full">
        <div className="w-full space-y-1">
          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/50 rounded-xl transition-colors border-b border-zinc-100/70">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200/40">
              <i className="ri-map-pin-user-fill text-xl"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Origin Terminal
              </h4>
              <p className="text-sm font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/50 rounded-xl transition-colors border-b border-zinc-100/70">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-950 text-white flex items-center justify-center">
              <i className="ri-map-pin-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Destination Terminal
              </h4>
              <p className="text-sm font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/50 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <i className="ri-wallet-3-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Final Settlement Gross
              </h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-zinc-900 tracking-tight">
                  ₹{props.ride?.fare}
                </span>
                <span className="text-[10px] font-bold uppercase text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full tracking-wide">
                  Collect Cash
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <button
          onClick={endRide}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold tracking-wide py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 transition-all cursor-pointer text-sm sm:text-base border-none outline-none"
        >
          <i className="ri-checkbox-circle-fill text-lg"></i>
          Finish Ride
        </button>
      </div>
    </div>
  );
};

export default FinishRide;
