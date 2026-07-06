import React, { useState, useEffect, useRef, useContext } from "react";
import maplibregl from "maplibre-gl";
import { SocketContext } from "../context/SocketContext";
import polyline from "@mapbox/polyline";
import axios from "axios";

const LiveTracking = ({ pickup, destination, otherUserLocation, userType, emitLocationTo }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const { socket } = useContext(SocketContext);

  const [initialPosition, setInitialPosition] = useState(null);
  const currentLocation = useRef(null);

  const animationFrameId = useRef(null);
  const [routePolyline, setRoutePolyline] = useState(null);
  const otherMarker = useRef(null);
  const otherAnimationFrameId = useRef(null);

  const routeProps = useRef({ pickup, destination });
  const pickupMarker = useRef(null);
  const destinationMarker = useRef(null);
  useEffect(() => {
    routeProps.current = { pickup, destination };
  }, [pickup, destination]);

  const getSelfMarkerElement = () => {
    const el = document.createElement("div");
    if (userType === "captain") {
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.backgroundImage = "url(/uberCar.png)";
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundPosition = "center";
    } else {
      el.style.width = "18px";
      el.style.height = "18px";
      el.style.backgroundColor = "#3b82f6";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    }
    return el;
  };

  const getOtherMarkerElement = () => {
    const el = document.createElement("div");
    if (userType === "captain") {
      // Captain sees User as a blue dot
      el.style.width = "18px";
      el.style.height = "18px";
      el.style.backgroundColor = "#3b82f6";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    } else {
      // User sees Captain as a car
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.backgroundImage = "url(/uberCar.png)";
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundPosition = "center";
    }
    return el;
  };

  // Fetch route if pickup and destination exist
  useEffect(() => {
    if (!pickup || !destination) return;
    const getRoute = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`,
          {
            params: { origin: pickup, destination: destination },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data?.data?.polyline) {
          setRoutePolyline(response.data.data.polyline);
        }
      } catch (err) {
        console.error("Error fetching route", err);
      }
    };
    getRoute();
  }, [pickup, destination]);

  // Draw route on map
  useEffect(() => {
    if (!map.current || !routePolyline) return;

    const drawRoute = () => {
      if (map.current.getSource("route")) return; // Already drawn

      try {
        const decoded = polyline.decode(routePolyline);
        const coordinates = decoded.map((c) => [c[1], c[0]]); // [lng, lat]

        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinates,
            },
          },
        });
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#000",
            "line-width": 4,
            "line-opacity": 0.8,
          },
        });

        // Fit bounds to the route
        const bounds = new maplibregl.LngLatBounds(coordinates[0], coordinates[0]);
        for (const coord of coordinates) {
          bounds.extend(coord);
        }
        map.current.fitBounds(bounds, { padding: 50 });

        // Add pickup (green) and destination (red) pins
        if (!pickupMarker.current) {
          pickupMarker.current = new maplibregl.Marker({ color: '#10b981' }) // green-500
            .setLngLat(coordinates[0])
            .addTo(map.current);
        } else {
          pickupMarker.current.setLngLat(coordinates[0]);
        }

        if (!destinationMarker.current) {
          destinationMarker.current = new maplibregl.Marker({ color: '#ef4444' }) // red-500
            .setLngLat(coordinates[coordinates.length - 1])
            .addTo(map.current);
        } else {
          destinationMarker.current.setLngLat(coordinates[coordinates.length - 1]);
        }
      } catch (error) {
        console.error("Error decoding polyline:", error);
      }
    };

    if (map.current.isStyleLoaded()) {
      drawRoute();
    } else {
      map.current.once("styledata", drawRoute);
    }
  }, [routePolyline, map.current]);

  const animateOtherMarker = (end, duration = 1000) => {
    if (!otherMarker.current) return;
    if (otherAnimationFrameId.current) {
      cancelAnimationFrame(otherAnimationFrameId.current);
    }

    const startLngLat = otherMarker.current.getLngLat();
    const start = { lat: startLngLat.lat, lng: startLngLat.lng };
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      const lng = start.lng + (end.lng - start.lng) * easeProgress;
      const lat = start.lat + (end.lat - start.lat) * easeProgress;

      otherMarker.current.setLngLat([lng, lat]);

      if (progress < 1) {
        otherAnimationFrameId.current = requestAnimationFrame(animate);
      }
    };

    otherAnimationFrameId.current = requestAnimationFrame(animate);
  };

  // Handle otherUserLocation
  useEffect(() => {
    if (!map.current || !otherUserLocation) return;
    
    if (!otherMarker.current) {
      otherMarker.current = new maplibregl.Marker({
        element: getOtherMarkerElement(),
      })
        .setLngLat([otherUserLocation.lng, otherUserLocation.lat])
        .addTo(map.current);
    } else {
      animateOtherMarker(otherUserLocation, 1000);
    }
  }, [otherUserLocation, map.current]);

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
      element: getSelfMarkerElement(),
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
        // ONLY if no route is drawn
        if (!pickup) {
          recenterCamera();
        }
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
        // Disable aggressive centering if a route is displayed, so we can test routes far from our physical location.
        if (map.current && !isUserInteracting.current && !pickup) {
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

          if (emitLocationTo) {
            socket.emit("live-location-update", {
              targetUserId: emitLocationTo,
              location: { lat: newLocation.lat, lng: newLocation.lng }
            });
          }
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
