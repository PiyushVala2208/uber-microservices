import React from "react";

const RidePopUp = (props) => {
  return (
    <div className="w-full bg-white flex flex-col select-none relative">
      <button
        onClick={() => props.setRidePopupPanel(false)}
        className="w-12 h-1 bg-zinc-200 hover:bg-zinc-300 rounded-full mx-auto absolute -top-1 left-1/2 -translate-x-1/2 transition-colors cursor-pointer"
        aria-label="Close panel"
      ></button>

      <div className="flex items-center justify-between mt-3 pt-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
              Live Dispatch Request
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight mt-0.5">
            New Ride Available!
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl mt-4 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <img
            className="h-11 w-11 rounded-full object-cover border border-zinc-200 shadow-xs shrink-0"
            src={
              props.ride?.user?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtgSnyw7CN3F5S3Ox-FU5wjh0YeyqN3L9eUviQUJ1kj5SCzt8uNqL-KRNBlwh0dOVYofHNeZicv0_lKn75Rmbm5Z51EQvtKVRKb6Qxb4ObRQ&s=10"
            }
            alt="Customer profile"
          />
          <div className="min-w-0 flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Passenger Name
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
            away
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4 w-full">
        <div className="w-full space-y-1">
          <div className="flex items-start gap-4 p-3 hover:bg-zinc-50/60 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center shadow-xs border border-zinc-200/50">
              <i className="ri-map-pin-user-fill text-xl"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Pickup Point
              </h4>
              <p className="text-sm font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          {/* Connected Vector Spline Track Link */}
          <div className="w-full px-7.5 -my-1">
            <div className="w-[2px] h-4 border-l-2 border-dashed border-zinc-200"></div>
          </div>

          {/* Node 2: Target Final Drop Destination */}
          <div className="flex items-start gap-4 p-3 hover:bg-zinc-50/60 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <i className="ri-map-pin-2-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Drop Destination
              </h4>
              <p className="text-sm font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          <div className="w-full px-7.5 -my-1">
            <div className="w-[2px] h-4 border-l-2 border-dashed border-zinc-200"></div>
          </div>

          <div className="flex items-start gap-4 p-3 hover:bg-zinc-50/60 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs border border-emerald-100">
              <i className="ri-wallet-3-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Expected Earnings
              </h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-extrabold text-zinc-900">
                  ₹{props.ride?.fare}
                </span>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                  Cash Trip
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 w-full flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        <button
          onClick={() => {
            props.setConfirmRidePopupPanel(true);
            props.confirmRide();
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold tracking-wide py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 transition-all cursor-pointer text-sm sm:text-base order-1 sm:order-2"
        >
          <i className="ri-checkbox-circle-fill text-lg"></i>
          Accept Ride Request
        </button>

        <button
          onClick={() => props.setRidePopupPanel(false)}
          className="w-full bg-zinc-100 hover:bg-zinc-200 active:scale-[0.99] text-zinc-700 font-bold tracking-wide py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm sm:text-base order-2 sm:order-1"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
