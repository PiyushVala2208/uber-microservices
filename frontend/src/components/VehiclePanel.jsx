import React from "react";

const VehiclePanel = (props) => {
  const handleVehiclePanelClose = () => {
    props.setVehiclePanelOpen(false);
    props.setPanelOpen(true);
  };

  return (
    <div className="w-full select-none">
      <h5
        className="w-full absolute top-2 left-0 flex justify-center cursor-pointer py-2 text-zinc-400 hover:text-zinc-800 transition-colors active:scale-95"
        onClick={() => {
          handleVehiclePanelClose();
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-6 mt-2">
        Choose a Vehicle
      </h3>

      <div className="space-y-3">
        <div
          onClick={() => {
            props.setConfirmRidePanelOpen(true);
            props.selectVehicle("car");
          }}
          className="flex border border-zinc-100 hover:border-zinc-300 active:border-black rounded-2xl w-full p-4 items-center justify-between cursor-pointer bg-white transition-all duration-200 active:scale-[0.98] hover:bg-zinc-50/50"
        >
          <img
            className="w-16 sm:w-20 object-contain shrink-0"
            src="/uberCar.png"
            alt="uber car"
          />
          <div className="flex-1 px-4 min-w-0">
            <h4 className="flex items-center gap-2 font-bold text-zinc-900 text-base sm:text-lg">
              UberGo
              <span className="flex items-center gap-1 font-medium text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                <i className="ri-user-3-fill text-[10px]"></i>4
              </span>
            </h4>
            <h5 className="font-semibold text-xs sm:text-sm text-emerald-600 mt-0.5">
              2 mins away
            </h5>
            <p className="font-normal text-xs text-zinc-500 truncate mt-0.5">
              Affordable, compact rides
            </p>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 shrink-0">
            ₹{props.fare.car}
          </h2>
        </div>

        <div
          onClick={() => {
            props.setConfirmRidePanelOpen(true);
            props.selectVehicle("moto");
          }}
          className="flex border border-zinc-100 hover:border-zinc-300 active:border-black rounded-2xl w-full p-4 items-center justify-between cursor-pointer bg-white transition-all duration-200 active:scale-[0.98] hover:bg-zinc-50/50"
        >
          <img
            className="w-16 sm:w-20 object-contain shrink-0"
            src="/uberBike.png"
            alt="uber bike"
          />
          <div className="flex-1 px-4 min-w-0">
            <h4 className="flex items-center gap-2 font-bold text-zinc-900 text-base sm:text-lg">
              Moto
              <span className="flex items-center gap-1 font-medium text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                <i className="ri-user-3-fill text-[10px]"></i>1
              </span>
            </h4>
            <h5 className="font-semibold text-xs sm:text-sm text-emerald-600 mt-0.5">
              5 mins away
            </h5>
            <p className="font-normal text-xs text-zinc-500 truncate mt-0.5">
              Affordable motorcycle rides
            </p>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 shrink-0">
            ₹{props.fare.moto}
          </h2>
        </div>

        <div
          onClick={() => {
            props.setConfirmRidePanelOpen(true);
            props.selectVehicle("auto");
          }}
          className="flex border border-zinc-100 hover:border-zinc-300 active:border-black rounded-2xl w-full p-4 items-center justify-between cursor-pointer bg-white transition-all duration-200 active:scale-[0.98] hover:bg-zinc-50/50"
        >
          <img
            className="w-16 sm:w-20 object-contain shrink-0"
            src="/uberAuto.webp"
            alt="uber auto"
          />
          <div className="flex-1 px-4 min-w-0">
            <h4 className="flex items-center gap-2 font-bold text-zinc-900 text-base sm:text-lg">
              UberAuto
              <span className="flex items-center gap-1 font-medium text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                <i className="ri-user-3-fill text-[10px]"></i>3
              </span>
            </h4>
            <h5 className="font-semibold text-xs sm:text-sm text-emerald-600 mt-0.5">
              8 mins away
            </h5>
            <p className="font-normal text-xs text-zinc-500 truncate mt-0.5">
              Affordable Auto rides
            </p>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 shrink-0">
            ₹{props.fare.auto}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default VehiclePanel;
