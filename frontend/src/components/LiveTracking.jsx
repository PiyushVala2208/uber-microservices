import React, { useState, useEffect, useRef, useContext } from "react";
import maplibregl from "maplibre-gl";
import { SocketContext } from "../context/SocketContext";

const LiveTracking = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const { socket } = useContext(SocketContext);

  const [initialPosition, setInitialPosition] = useState(null);
  const currentLocation = useRef(null);

  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      const initialLoc = { lat: latitude, lng: longitude };
      setInitialPosition(initialLoc);
      currentLocation.current = initialLoc;
    };

    const handleError = (error) => {
      console.error("Error getting location", error);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
    });
  }, []);

  const isUserInteracting = useRef(false);
  // Stores the id of the pending recenter timer so we can cancel it on re-interaction
  const idleTimerRef = useRef(null);

  // Smoothly fly camera back to the current pin position
  const recenterCamera = () => {
    if (!map.current || !currentLocation.current) return;
    map.current.easeTo({
      center: [currentLocation.current.lng, currentLocation.current.lat],
      duration: 1200,
      padding: { top: 200, bottom: 0, left: 0, right: 0 },
      easing: (t) => 1 - Math.pow(1 - t, 4),
      essential: true,
    });
  };

  useEffect(() => {
    if (!initialPosition || !mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [initialPosition.lng, initialPosition.lat],
      zoom: 16,
      pitch: 50,
      bearing: 0,
      antialias: true,
      maxZoom: 20,
    });

    // map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    marker.current = new maplibregl.Marker({
      color: "#000",
    })
      .setLngLat([initialPosition.lng, initialPosition.lat])
      .addTo(map.current);

    // ── Idle recenter logic ─────────────────────────────────────────────────────
    // Any interaction cancels the pending timer and marks the user as active.
    // 10 seconds after the last interaction ends, the camera snaps back to the pin.
    const clearIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };

    const handleInteractionStart = () => {
      isUserInteracting.current = true;
      clearIdleTimer(); // Cancel any pending recenter while actively interacting
    };

    const handleInteractionEnd = () => {
      clearIdleTimer();
      idleTimerRef.current = setTimeout(() => {
        isUserInteracting.current = false;
        // After 10 seconds of idle, smoothly fly back to the driver's pin
        recenterCamera();
      }, 10000);
    };

    map.current.on("dragstart", handleInteractionStart);
    map.current.on("dragend", handleInteractionEnd);
    map.current.on("touchstart", handleInteractionStart);
    map.current.on("touchend", handleInteractionEnd);
    map.current.on("zoomstart", handleInteractionStart);
    map.current.on("zoomend", handleInteractionEnd);

    return () => {
      clearIdleTimer();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialPosition]);

  const animateMarker = (end, duration = 1000) => {
    if (!marker.current) return;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Always start from the marker's exact current interpolated position
    // to avoid any jumping if new data arrives before animation finishes.
    const startLngLat = marker.current.getLngLat();
    const start = { lat: startLngLat.lat, lng: startLngLat.lng };
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);

      // easeOutQuart easing for premium responsive momentum
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      const lng = start.lng + (end.lng - start.lng) * easeProgress;
      const lat = start.lat + (end.lat - start.lat) * easeProgress;

      marker.current.setLngLat([lng, lat]);

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!navigator.geolocation || !initialPosition) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (currentLocation.current) {
          animateMarker(newLocation, 1000);
        }

        // Only move the map if the user hasn't dragged it recently
        if (map.current && !isUserInteracting.current) {
          map.current.easeTo({
            center: [newLocation.lng, newLocation.lat],
            duration: 1000,
            padding: { top: 200 }, // Keep driver slightly below center like Uber
            // Match the easeOutQuart easing function of the marker for perfect sync
            easing: (t) => 1 - Math.pow(1 - t, 4),
            essential: true,
            // Notice we do NOT pass zoom, pitch, or bearing here,
            // so if the user zooms out, we preserve their zoom level!
          });
        }

        currentLocation.current = newLocation;

        if (socket) {
          socket.emit("update-location", {
            lat: newLocation.lat,
            lng: newLocation.lng,
          });
        }
      },
      (err) => console.log(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [initialPosition, socket]);

  if (!initialPosition) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Fetching live location...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default LiveTracking;
