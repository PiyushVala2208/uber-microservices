import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanelOpen, setConfirmRidePanelOpen] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (user && user._id) {
      socket.emit("join", { userType: "user", userId: user._id });
      
      const onConnect = () => {
        socket.emit("join", { userType: "user", userId: user._id });
      };
      
      socket.on("connect", onConnect);
      
      return () => {
        socket.off("connect", onConnect);
      };
    }
  }, [user, socket]);

  socket.on("ride-confirmed", (ride) => {
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    console.log("ride");
    setWaitingForDriver(false);
    navigate("/riding", { state: { ride, vehicleType } });
  });

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setPickupSuggestions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setDestinationSuggestions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/maps/get-address`,
            {
              params: { lat: latitude, lng: longitude },
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          const address = response.data.data;
          if (activeField === "pickup") {
            setPickup(address);
          } else {
            setDestination(address);
          }
          setPanelOpen(false);
        } catch (error) {
          console.error("Error fetching address:", error);
          alert("Could not fetch address for current location.");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Could not get your current location.");
      }
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "72%",
          padding: window.innerWidth < 640 ? 16 : 24,
          opacity: 1,
          display: "block",
          ease: "power4.out",
          duration: 0.5,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
          scale: 1,
          ease: "back.out(1.7)",
          duration: 0.5,
        });
      } else {
        gsap.to(panelRef.current, {
          height: 0,
          padding: 0,
          opacity: 0,
          display: "none",
          ease: "power4.inOut",
          duration: 0.5,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
          scale: 0.7,
          ease: "power2.in",
          duration: 0.5,
        });
      }
    },
    [panelOpen],
  );

  useGSAP(
    function () {
      if (vehiclePanelOpen) {
        gsap.to(vehiclePanelRef.current, {
          y: 0,
          ease: "power4.out",
          duration: 0.5,
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          y: "100%",
          ease: "power4.in",
          duration: 0.5,
        });
      }
    },
    [vehiclePanelOpen],
  );

  useGSAP(
    function () {
      if (confirmRidePanelOpen) {
        gsap.to(confirmRidePanelRef.current, {
          y: 0,
          ease: "power4.out",
          duration: 0.5,
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          y: "100%",
          ease: "power4.in",
          duration: 0.5,
        });
      }
    },
    [confirmRidePanelOpen],
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          y: 0,
          ease: "power4.out",
          duration: 0.5,
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          y: "100%",
          ease: "power4.in",
          duration: 0.5,
        });
      }
    },
    [vehicleFound],
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          y: 0,
          ease: "power4.out",
          duration: 0.5,
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          y: "100%",
          ease: "power4.in",
          duration: 0.5,
        });
      }
    },
    [waitingForDriver],
  );

  const findTrip = async () => {
    setVehiclePanelOpen(true);
    setPanelOpen(false);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
      {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    setFare(response.data);
  };

  const createRide = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      {
        pickup,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-slate-50 antialiased select-none">
      <div className="absolute inset-0 z-0 w-full h-full">
        <LiveTracking userType="user" />
      </div>

      <div className="absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-10 pointer-events-none">
        <img
          className="w-16 sm:w-20 md:w-24 object-contain pointer-events-auto filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform duration-300 active:scale-95"
          src="/uber.png"
          alt="Uber Logo"
        />
        <Link
          to="/user/logout"
          className="h-11 w-11 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full shadow-lg shadow-black/5 border border-zinc-200/60 pointer-events-auto transition-all hover:scale-105 active:scale-95"
        >
          <i className="text-xl font-medium text-zinc-800 ri-logout-circle-r-line"></i>
        </Link>
      </div>

      <div className="flex flex-col justify-end h-screen absolute bottom-0 w-full z-10 pointer-events-none md:max-w-xl md:left-1/2 md:-translate-x-1/2">
        <div className="h-auto p-5 sm:p-6 bg-white relative pointer-events-auto rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)] border-b border-gray-100 flex flex-col justify-between shrink-0">
          <div>
            <h5
              ref={panelCloseRef}
              onClick={() => setPanelOpen(false)}
              className="absolute opacity-0 right-6 top-6 text-2xl text-gray-500 hover:text-black cursor-pointer w-8 h-8 flex items-center justify-center  rounded-full transition-colors active:scale-90"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>

            <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Plan your trip
            </h4>

            <form className="relative mt-4 space-y-3" onSubmit={submitHandler}>
              <div className="line absolute h-16 w-0.5 top-[50%] -translate-y-1/2 left-6 bg-gray-700 rounded-full"></div>

              <div className="relative group">
                <i className="ri-map-pin-line absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 group-focus-within:text-black transition-colors"></i>
                <input
                  type="text"
                  value={pickup}
                  onClick={() => {
                    setPanelOpen(true);
                    setActiveField("pickup");
                  }}
                  onChange={handlePickupChange}
                  placeholder="Enter pickup location"
                  className="bg-gray-50 text-gray-900 px-12 py-3 text-base sm:text-md rounded-xl w-full border border-gray-200 outline-none focus:bg-white focus:border-black font-medium tracking-wide transition-all placeholder-gray-400"
                />
              </div>

              <div className="relative group">
                <i className="ri-map-pin-fill absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 group-focus-within:text-black transition-colors"></i>
                <input
                  type="text"
                  value={destination}
                  onClick={() => {
                    setPanelOpen(true);
                    setActiveField("destination");
                  }}
                  onChange={handleDestinationChange}
                  placeholder="Where to?"
                  className="bg-gray-50 text-gray-900 px-12 py-3 text-base sm:text-md rounded-xl w-full border border-gray-200 outline-none focus:bg-white focus:border-black font-medium tracking-wide transition-all placeholder-gray-400"
                />
              </div>
            </form>
          </div>

          <button
            onClick={findTrip}
            className="bg-black hover:bg-zinc-800 text-white font-medium py-3.5 px-4 rounded-xl mt-4 w-full shadow-lg shadow-black/10 active:scale-[0.99] transition-all tracking-wide text-base sm:text-md"
          >
            Find Trip
          </button>
        </div>

        <div
          ref={panelRef}
          className="h-0 overflow-y-auto custom-scrollbar bg-white pointer-events-auto border-t border-gray-50"
        >
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanelOpen={setVehiclePanelOpen}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
            useCurrentLocation={handleUseCurrentLocation}
          />
        </div>
      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full max-w-xl left-0 right-0 mx-auto z-20 bottom-0 rounded-t-[2.5rem] translate-y-full bg-white px-4 py-6 pt-10 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] border border-gray-100"
      >
        <VehiclePanel
          setVehiclePanelOpen={setVehiclePanelOpen}
          setConfirmRidePanelOpen={setConfirmRidePanelOpen}
          fare={fare}
          selectVehicle={setVehicleType}
          setPanelOpen={setPanelOpen}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed w-full max-w-xl left-0 right-0 mx-auto z-20 bottom-0 rounded-t-[2.5rem] translate-y-full bg-white px-4 py-6 pt-10 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] border border-gray-100"
      >
        <ConfirmRide
          createRide={createRide}
          setConfirmRidePanelOpen={setConfirmRidePanelOpen}
          setVehicleFound={setVehicleFound}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full max-w-xl left-0 right-0 mx-auto z-20 bottom-0 rounded-t-[2.5rem] translate-y-full bg-white px-4 py-6 pt-10 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] border border-gray-100"
      >
        <LookingForDriver
          createRide={createRide}
          setVehicleFound={setVehicleFound}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
        />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed w-full max-w-xl left-0 right-0 mx-auto z-20 bottom-0 rounded-t-[2.5rem] translate-y-full bg-white px-4 py-6 pt-10 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] border border-gray-100"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
