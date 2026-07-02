import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!socket || !captain?._id) return;

    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => clearInterval(locationInterval);
  }, [captain, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log("New ride received:", data);
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  const confirmRide = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error("Error confirming ride request parameters:", error);
    }
  };

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0%)",
          duration: 0.6,
          ease: "power4.out",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.6,
          ease: "power4.out",
        });
      }
    },
    [ridePopupPanel],
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0%)",
          duration: 0.6,
          ease: "power4.out",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.6,
          ease: "power4.out",
        });
      }
    },
    [confirmRidePopupPanel],
  );

  return (
    <div className="h-screen w-full relative overflow-hidden bg-slate-50 antialiased select-none">
      <div className="absolute inset-0 z-0 w-full h-full">
        <LiveTracking />
      </div>

      <div className="fixed top-4 left-0 w-full px-5 flex items-center justify-between z-50 pointer-events-none">
        <img
          className="w-20 sm:w-24 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)] pointer-events-auto select-none"
          src="uber.png"
          alt="Uber System Suite"
        />
        <Link
          to="/captain-home"
          className="h-11 w-11 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full shadow-lg shadow-black/5 border border-zinc-200/60 pointer-events-auto transition-all hover:scale-105 active:scale-95"
        >
          <i className="text-xl font-medium text-zinc-800 ri-logout-circle-r-line"></i>
        </Link>
      </div>

      <div className="flex flex-col justify-end h-screen absolute bottom-0 w-full z-10 pointer-events-none md:max-w-xl md:left-1/2 md:-translate-x-1/2">
        <div className="h-auto min-h-[240px] max-h-[38vh] p-5 sm:p-6 bg-white relative pointer-events-auto rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col justify-between">
          <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto mb-5 shrink-0"></div>
          <div className="w-full flex-1 overflow-y-auto custom-scrollbar">
            <CaptainDetails />
          </div>
        </div>
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full  max-w-xl left-0 right-0 mx-auto z-40 bottom-0 rounded-t-[2.5rem] translate-y-full bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.12)] px-4 pb-8 pt-4 border border-zinc-100"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full max-w-xl left-0 right-0 mx-auto z-50 bottom-0 rounded-t-[2.5rem] translate-y-full bg-white px-4 pb-8 pt-6 shadow-[0_-20px_50px_rgba(0,0,0,0.12)] border border-zinc-100"
      >
        <div className="w-full">
          <ConfirmRidePopUp
            ride={ride}
            setRidePopupPanel={setRidePopupPanel}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
