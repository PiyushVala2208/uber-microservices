import React from "react";

const LocationSearchPanel = ({
  suggestions,
  setPanelOpen,
  setVehiclePanelOpen,
  setPickup,
  setDestination,
  activeField,
  useCurrentLocation,
}) => {
  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion?.address || suggestion);
    } else {
      setDestination(suggestion?.address || suggestion);
    }
  };

  return (
    <div className="mt-6 px-1 space-y-2.5 pb-6">
      <div
        onClick={useCurrentLocation}
        className="group flex gap-4 border border-blue-100 p-3.5 hover:border-blue-300 active:border-blue-500 rounded-xl items-center justify-start cursor-pointer transition-all duration-300 hover:bg-blue-50/80 active:scale-[0.99]"
      >
        <div className="bg-blue-100 h-10 w-10 shrink-0 flex items-center justify-center rounded-full text-blue-700 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
          <i className="ri-focus-3-line text-lg"></i>
        </div>
        <div className="flex flex-col min-w-0 w-full">
          <h4 className="font-semibold text-blue-700 text-sm sm:text-base tracking-wide truncate group-hover:text-blue-800 transition-colors">
            Use current location
          </h4>
        </div>
      </div>

      {suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(elem)}
          className="group flex gap-4 border border-gray-100 p-3.5 hover:border-zinc-300 active:border-black rounded-xl items-center justify-start cursor-pointer transition-all duration-300 hover:bg-zinc-50/80 active:scale-[0.99]"
        >
          <div className="bg-zinc-100 h-10 w-10 shrink-0 flex items-center justify-center rounded-full text-zinc-700 transition-all duration-300 group-hover:bg-black group-hover:text-white group-active:scale-90 shadow-sm">
            <i className="ri-map-pin-2-fill text-lg"></i>
          </div>

          <div className="flex flex-col min-w-0 w-full">
            <h4 className="font-semibold text-zinc-800 text-sm sm:text-base tracking-wide truncate group-hover:text-black transition-colors">
              {elem?.address || elem}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
