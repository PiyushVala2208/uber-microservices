import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CapatainContext";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);

  return (
    <div className="w-full bg-white flex flex-col justify-between h-full select-none">
      <div className="flex items-center justify-between gap-4 bg-zinc-50/60 p-4 rounded-2xl border border-zinc-100/80">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md shadow-black/5"
              src={
                captain?.avatar ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa9fLaPV2o6lY8SM8km4BJBixNih1VqqRdHg&s"
              }
              alt="Captain Profile"
            />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
          </div>

          <div className="min-w-0 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Active Captain
            </span>
            <h4 className="text-base font-black text-zinc-900 capitalize truncate mt-0.5">
              {captain?.fullname
                ? `${captain.fullname.firstname} ${captain.fullname.lastname}`
                : "Premium Captain"}
            </h4>
          </div>
        </div>

        <div className="text-right shrink-0 bg-white px-3.5 py-2 rounded-xl border border-zinc-100 shadow-xs">
          <h4 className="text-lg font-black text-zinc-950 tracking-tight">
            ₹295.20
          </h4>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mt-0.5">
            Today's Earned
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5 w-full">
        <div className="bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-100/70 p-3 rounded-2xl text-center transition-all duration-300 flex flex-col items-center justify-center gap-1 group">
          <div className="h-9 w-9 rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-700 flex items-center justify-center transition-colors duration-300 shadow-xs">
            <i className="text-lg ri-timer-2-fill"></i>
          </div>
          <h5 className="text-base font-black text-zinc-900 mt-1">10.2</h5>
          <p className="text-[11px] font-medium text-zinc-400 tracking-tight leading-none">
            Hours Online
          </p>
        </div>

        <div className="bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-100/70 p-3 rounded-2xl text-center transition-all duration-300 flex flex-col items-center justify-center gap-1 group">
          <div className="h-9 w-9 rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-700 flex items-center justify-center transition-colors duration-300 shadow-xs">
            <i className="text-lg ri-map-2-fill"></i>
          </div>
          <h5 className="text-base font-black text-zinc-900 mt-1">42.8</h5>
          <p className="text-[11px] font-medium text-zinc-400 tracking-tight leading-none">
            KM Covered
          </p>
        </div>

        <div className="bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-100/70 p-3 rounded-2xl text-center transition-all duration-300 flex flex-col items-center justify-center gap-1 group">
          <div className="h-9 w-9 rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-700 flex items-center justify-center transition-colors duration-300 shadow-xs">
            <i className="text-lg ri-checkbox-circle-fill"></i>
          </div>
          <h5 className="text-base font-black text-zinc-900 mt-1">14</h5>
          <p className="text-[11px] font-medium text-zinc-400 tracking-tight leading-none">
            Total Rides
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
