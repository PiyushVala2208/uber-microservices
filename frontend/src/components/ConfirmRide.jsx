import React from "react";

const ConfirmRide = (props) => {
  const vehicleImages = {
    car: "/uberCar.png",
    moto: "/uberBike.png",
    auto: "/uberAuto.webp",
  };

  const vehicleNames = {
    car: "UberGo",
    moto: "Moto",
    auto: "UberAuto",
  };

  return (
    <div className="w-full select-none pb-2">
      <h5
        className="w-full absolute top-2 left-0 flex justify-center cursor-pointer py-2 text-zinc-400 hover:text-zinc-800 transition-colors active:scale-95"
        onClick={() => {
          props.setConfirmRidePanelOpen(false);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-5 mt-2">
        Confirm your Ride
      </h3>

      <div className="flex flex-col items-center">
        <div className="h-28 sm:h-32 flex items-center justify-center dynamic-float-animation">
          <img
            className="h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
            src={vehicleImages[props.vehicleType] || "/uberCar.png"}
            alt={props.vehicleType}
          />
        </div>

        <div className="w-full mt-6 space-y-1">
          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/80 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center shadow-sm">
              <i className="ri-map-pin-line text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Pickup Location
              </h4>
              <p className="text-sm sm:text-base font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.pickup}
              </p>
            </div>
          </div>

          <div className="w-full px-8 -my-1">
            <div className="w-[2px] h-4 border-l-2 border-dashed border-zinc-200"></div>
          </div>

          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/80 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-sm">
              <i className="ri-map-pin-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Drop-off Destination
              </h4>
              <p className="text-sm sm:text-base font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.destination}
              </p>
            </div>
          </div>

          <div className="w-full px-8 -my-1">
            <div className="w-[2px] h-4 border-l-2 border-dashed border-zinc-200"></div>
          </div>

          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/80 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-sm">
              <i className="ri-wallet-3-fill text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Fare Estimation ({vehicleNames[props.vehicleType] || "Ride"})
              </h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-zinc-900">
                  ₹{props.fare[props.vehicleType]}
                </span>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                  Cash Payment
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              props.setVehicleFound(true);
              props.setConfirmRidePanelOpen(false);
              props.createRide();
            }}
            className="w-full mt-6 bg-black hover:bg-zinc-800 text-white font-semibold py-4 px-4 rounded-xl shadow-lg shadow-black/10 active:scale-[0.99] transition-all tracking-wide text-base sm:text-md"
          >
            Confirm Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRide;
