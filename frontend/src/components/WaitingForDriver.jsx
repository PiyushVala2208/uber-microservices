import React from "react";

const WaitingForDriver = (props) => {
  const vehicleImages = {
    car: "/uberCar.png",
    moto: "/uberBike.png",
    auto: "/uberAuto.webp",
  };

  const currentVehicleType = props.ride?.captain?.vehicle?.vehicleType || "car";

  return (
    <div className="w-full select-none pb-2">
      <h5
        className="w-full absolute top-2 left-0 flex justify-center cursor-pointer py-2 text-zinc-400 hover:text-zinc-800 transition-colors active:scale-95"
        onClick={() => {
          props.setWaitingForDriver(false);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-line"></i>
      </h5>

      <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-5 pt-4 mt-2">
        <div className="w-22 h-22 flex items-center justify-center shrink-0 bg-zinc-50/50 rounded-2xl p-1 border border-zinc-100">
          <img
            className="h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
            src={vehicleImages[currentVehicleType] || "/uberCar.png"}
            alt="confirmed vehicle"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col items-start">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Your Captain
          </span>
          <h3 className="text-base sm:text-lg font-black text-zinc-900 capitalize truncate mt-0.5">
            {props.ride?.captain?.fullname?.firstname || "Driver"}
          </h3>
          <p className="text-xs font-semibold text-zinc-500 truncate mt-0.5">
            Maruti Suzuki Alto
          </p>

          <div className="mt-2 bg-zinc-100 border border-zinc-200/80 px-2.5 py-0.5 rounded font-mono text-xs font-bold text-zinc-800 tracking-wider shadow-xs uppercase">
            {props.ride?.captain?.vehicle?.plate || "KA-01-XX-0000"}
          </div>
        </div>

        <div className="bg-zinc-900 text-white px-3.5 py-2.5 rounded-2xl flex flex-col items-center justify-center min-w-[76px] sm:min-w-[82px] shadow-sm shrink-0">
          <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-400">
            PIN
          </span>
          <h1 className="text-base sm:text-lg font-black tracking-wider text-emerald-400 font-mono mt-0.5">
            {props.ride?.otp}
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="w-full space-y-1">
          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/50 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center shadow-sm">
              <i className="ri-map-pin-line text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Pickup Point
              </h4>
              <p className="text-sm sm:text-base font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="w-full px-8 -my-1">
            <div className="w-[2px] h-4 border-l-2 border-dashed border-zinc-200"></div>
          </div>

          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/50 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-sm">
              <i className="ri-map-pin-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Drop-off Destination
              </h4>
              <p className="text-sm sm:text-base font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          <div className="w-full px-8 -my-1">
            <div className="w-[2px] h-4 border-l-2 border-dashed border-zinc-200"></div>
          </div>

          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/50 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-sm">
              <i className="ri-wallet-3-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Payment Due
              </h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-zinc-900">
                  ₹{props.ride?.fare}
                </span>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                  Cash Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
