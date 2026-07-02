import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleRideEnded = () => {
      navigate("/home");
    };

    socket.on("ride-ended", handleRideEnded);

    return () => {
      socket.off("ride-ended", handleRideEnded);
    };
  }, [socket, navigate]);

  const vehicleImages = {
    car: "/uberCar.png",
    moto: "/uberBike.png",
    auto: "/uberAuto.webp",
  };

  const currentVehicleType =
    location.state?.vehicleType || ride?.captain?.vehicle?.vehicleType || "car";

  return (
    <div className="h-screen w-full bg-zinc-100 flex flex-col justify-start relative overflow-hidden select-none">
      <Link
        to="/home"
        className="fixed left-4 top-4 h-11 w-11 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full shadow-lg shadow-black/5 border border-zinc-200/50 z-50 transition-all hover:scale-105 active:scale-95"
      >
        <i className="text-xl font-medium text-zinc-800 ri-home-3-fill"></i>
      </Link>

      <div className="w-full flex-1 h-[50vh] relative bg-zinc-200">
        <LiveTracking />
      </div>

      <div className="w-full bg-white rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.06)] px-5 pb-6 pt-4 flex flex-col justify-between border-t border-zinc-100/80 z-10 relative">
        <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto mb-4 shrink-0"></div>

        <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="w-22 h-22 flex items-center justify-center shrink-0 bg-zinc-50/60 rounded-2xl p-1 border border-zinc-100">
            <img
              className="h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.05)]"
              src={vehicleImages[currentVehicleType] || "uberCar.png"}
              alt="active trip vehicle"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col items-start">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                In-Route to Destination
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 capitalize truncate mt-0.5">
              {ride?.captain?.fullname?.firstname || "Captain"}
            </h3>
            <p className="text-xs font-semibold text-zinc-500 truncate mt-0.5">
              Maruti Suzuki Alto
            </p>

            <div className="mt-2 bg-zinc-100 border border-zinc-200/60 px-2.5 py-0.5 rounded font-mono text-xs font-bold text-zinc-800 tracking-wider shadow-xs uppercase">
              {ride?.captain?.vehicle?.plate || "KA-01-XX-0000"}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-3 flex-1">
          <div className="w-full space-y-1">
            <div className="flex items-start gap-4 p-3 hover:bg-zinc-50/40 rounded-xl transition-colors">
              <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                <i className="ri-map-pin-fill text-base"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Dropping Off At
                </h4>
                <p className="text-sm sm:text-base font-semibold text-zinc-800 wrao-break-words mt-0.5">
                  {ride?.destination}
                </p>
              </div>
            </div>

            <div className="w-full px-7.5 -my-1">
              <div className="w-[2px] h-4 border-l-2 border-dashed border-zinc-200"></div>
            </div>

            <div className="flex items-start gap-4 p-3 hover:bg-zinc-50/40 rounded-xl transition-colors">
              <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                <i className="ri-wallet-3-fill text-base"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Total Value of Transaction
                </h4>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg sm:text-xl font-extrabold text-zinc-900">
                    ₹{ride?.fare}
                  </span>
                  <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                    Cash Payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full mt-5 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.99] text-white font-bold tracking-wide py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-zinc-950/10 transition-all cursor-pointer text-sm sm:text-base">
          <i className="ri-secure-payment-line text-lg"></i>
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
