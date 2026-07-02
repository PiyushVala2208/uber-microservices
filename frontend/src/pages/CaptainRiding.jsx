import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  const location = useLocation();
  const rideData = location.state?.ride;

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0%)",
          duration: 0.4,
          ease: "power3.out",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.4,
          ease: "power3.in",
        });
      }
    },
    [finishRidePanel],
  );

  return (
    <div className="h-screen w-full relative overflow-hidden select-none">
      <style>{`
        @keyframes modernShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      <div className="fixed top-0 left-0 w-full p-6 z-20 pointer-events-none">
        <img
          className="w-20 sm:w-24 object-contain pointer-events-auto"
          src="uber.png"
          alt="Uber Logo"
        />
      </div>

      <div className="absolute inset-0 h-full w-full z-0">
        <LiveTracking />
      </div>

      <div
        className="fixed bottom-0 left-0 w-full bg-yellow-400 p-6 pt-12 flex items-center justify-between z-20 shadow-[0_-10px_35px_rgba(0,0,0,0.25)] rounded-t-4xl cursor-pointer"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <div
          className="absolute top-1 left-0 w-full flex justify-center py-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setFinishRidePanel(true);
          }}
        >
          <i className="text-3xl text-zinc-900 ri-arrow-up-wide-line transition-transform duration-300 group-hover:-translate-y-0.5"></i>
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            {rideData?.distance || "4"} KM away
          </h4>

          <div className="w-24 h-1 bg-zinc-900/15 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full w-1/2 bg-zinc-900 rounded-full"
              style={{
                animation:
                  "modernShimmer 2.2s infinite cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            ></div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setFinishRidePanel(true);
          }}
          className="bg-zinc-950 hover:bg-zinc-900 active:scale-95 text-white font-black text-sm sm:text-base py-3.5 px-8 sm:px-10 rounded-xl transition-all shadow-md cursor-pointer shrink-0"
        >
          Complete Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed left-0 right-0 bottom-0 w-full z-50 translate-y-full bg-white px-4 sm:px-6 py-8 pt-5 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] pointer-events-auto"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
