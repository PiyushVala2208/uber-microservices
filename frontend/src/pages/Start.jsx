import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Start = () => {
  const [destination, setDestination] = useState("/login");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Try user profile first
        const userRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (userRes.status === 200) {
          setDestination("/home");
          setLoading(false);
          return;
        }
      } catch (err) {
        // Not a user, move on to check captain
      }

      try {
        // Try captain profile
        const captainRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (captainRes.status === 200) {
          setDestination("/captain-home");
          setLoading(false);
          return;
        }
      } catch (err) {
        // Invalid token for both, ignore
      }

      setLoading(false);
    };

    checkToken();
  }, []);

  const handleContinue = (e) => {
    e.preventDefault();
    if (!loading) {
      navigate(destination);
    }
  };

  return (
    <div className="w-full h-dvh min-h-dvh bg-black flex flex-col overflow-hidden select-none">
      <div className="relative flex-1 bg-cover bg-bottom bg-[url('/image1.webp')] pt-8 px-6 flex flex-col justify-between">
        <img
          className="w-20 sm:w-24 object-contain"
          src="/uber.png"
          alt="Uber Logo"
        />
        <p className="flex-1 pl-1 text-[12px] text-zinc-800 font-medium tracking-wide">
          Move the way you want.
        </p>
      </div>

      <div className="bg-white pb-5 pt-5 px-6  shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Get Started with Uber
        </h2>

        <Link
          onClick={handleContinue}
          to={destination}
          className={`flex items-center justify-center w-full bg-black text-white text-base font-medium py-4 rounded-xl mt-3 transition-transform duration-100 ${
            loading ? "opacity-70 pointer-events-none" : "active:scale-[0.98]"
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Checking session...
            </div>
          ) : (
            "Continue"
          )}
        </Link>
      </div>
    </div>
  );
};

export default Start;
