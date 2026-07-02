import React from "react";

const LookingForDriver = (props) => {
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
    <div className="w-full select-none pb-2 relative">
      <h5
        className="absolute top-2 right-2 p-2 cursor-pointer text-zinc-400 hover:text-zinc-800 transition-colors  hover:bg-zinc-100 rounded-full w-8 h-8 flex items-center justify-center active:scale-90 z-30"
        onClick={() => {
          props.setVehicleFound(false);
        }}
      >
        <i className="text-2xl ri-close-line"></i>
      </h5>

      <div className="mb-5 mt-2">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
          Looking for a Driver
        </h3>
        <p className="text-xs font-medium text-zinc-400 tracking-wide mt-0.5 animate-pulse">
          Connecting with dispatch network...
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-full h-48 flex items-center justify-center">
          <style>{`
           @keyframes luxuryRadar {
            0% {
            transform: scale(0.4);
            opacity: 0;
            }
            10% {
            opacity: 0.6;
            }
      100% {
        transform: scale(2.2);
        opacity: 0;
      }
    }
  `}</style>

          <div
            className="absolute w-28 h-28 rounded-full border border-zinc-900/15 bg-zinc-900/3"
            style={{
              animation:
                "luxuryRadar 3.5s infinite cubic-bezier(0.1, 0.8, 0.3, 1)",
            }}
          ></div>

          <div
            className="absolute w-28 h-28 rounded-full border border-zinc-900/10 bg-zinc-900/1"
            style={{
              animation:
                "luxuryRadar 3.5s infinite cubic-bezier(0.1, 0.8, 0.3, 1)",
              animationDelay: "1.1s",
            }}
          ></div>

          <div
            className="absolute w-28 h-28 rounded-full border border-zinc-900/5 bg-zinc-900/0.5"
            style={{
              animation:
                "luxuryRadar 3.5s infinite cubic-bezier(0.1, 0.8, 0.3, 1)",
              animationDelay: "2.2s",
            }}
          ></div>

          <div className="absolute w-36 h-36 rounded-full bg-linear-to-tr from-zinc-50 to-zinc-100/60 border border-zinc-200/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)] animate-pulse [animation-duration:3s]"></div>

          <img
            className="h-24 rounded-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.1)] relative z-10 transition-transform duration-500 ease-in-out hover:scale-105"
            src={vehicleImages[props.vehicleType] || "/uberCar.png"}
            alt={props.vehicleType}
          />
        </div>

        <div className="w-24 h-1 bg-zinc-100 rounded-full overflow-hidden mt-3 relative">
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

        <div className="w-full mt-6 space-y-1">
          <div className="flex items-start gap-4 p-3.5 hover:bg-zinc-50/50 rounded-xl transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center shadow-sm">
              <i className="ri-map-pin-line text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Pickup Point
              </h4>
              <p className="text-sm sm:text-base font-semibold text-zinc-800 wrap-break-words mt-0.5">
                {props.pickup}
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
                {props.destination}
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
                Fare Rate ({vehicleNames[props.vehicleType] || "Ride"})
              </h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-zinc-900">
                  ₹{props.fare[props.vehicleType]}
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

export default LookingForDriver;
