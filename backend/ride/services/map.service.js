import axios from "axios";

export const getAddressCoordinate = async (address) => {
  try {
    const response = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          text: address,
          size: 1,
        },
      },
    );

    const features = response.data.features;

    if (!features || features.length === 0) {
      throw new Error("Address not found");
    }

    const [lng, ltd] = features[0].geometry.coordinates;

    return {
      ltd,
      lng,
    };
  } catch (error) {
    console.error("Service Error in getAddressCoordinate:", error.message);
    throw error;
  }
};

export const getAddressCoordinateReverse = async (lat, lng) => {
  try {
    const response = await axios.get(
      "https://api.openrouteservice.org/geocode/reverse",
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          "point.lon": lng,
          "point.lat": lat,
          size: 1,
        },
      },
    );

    const features = response.data.features;
    if (!features || features.length === 0) {
      throw new Error("Address not found");
    }

    return features[0].properties.label;
  } catch (error) {
    console.error("Service Error in getAddressCoordinateReverse:", error.message);
    throw error;
  }
};

export const getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  try {
    const geocodeOrigin = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          text: origin,
          size: 1,
        },
      },
    );

    const geocodeDestination = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          text: destination,
          size: 1,
        },
      },
    );

    if (
      !geocodeOrigin.data.features.length ||
      !geocodeDestination.data.features.length
    ) {
      throw new Error("Location not found");
    }

    const originCoords = geocodeOrigin.data.features[0].geometry.coordinates;

    const destinationCoords =
      geocodeDestination.data.features[0].geometry.coordinates;

    const routeResponse = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        coordinates: [originCoords, destinationCoords],
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    const summary = routeResponse.data.routes[0].summary;
    const geometry = routeResponse.data.routes[0].geometry;

    return {
      distance: {
        text: `${(summary.distance / 1000).toFixed(2)} km`,
        value: summary.distance,
      },
      duration: {
        text: `${Math.ceil(summary.duration / 60)} mins`,
        value: summary.duration,
      },
      polyline: geometry,
    };
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.message.includes('ECONNREFUSED')) {
      console.warn("⚠️ OpenRouteService API is currently unreachable. Using mock distance/time for development.");
      return {
        distance: { text: "10.00 km", value: 10000 },
        duration: { text: "20 mins", value: 1200 },
      };
    }
    console.error("Service Error in getDistanceTime:", err.message);
    throw err;
  }
};

export const getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  try {
    const response = await axios.get(
      "https://api.openrouteservice.org/geocode/autocomplete",
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          text: input,
          size: 5,
        },
      },
    );

    const features = response.data.features || [];

    return features.map((feature) => ({
      address: feature.properties.label,

      name:
        feature.properties.name ||
        feature.properties.locality ||
        feature.properties.label,

      coordinates: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
      },

      country: feature.properties.country,

      region: feature.properties.region,

      locality: feature.properties.locality,

      postalCode: feature.properties.postalcode,
    }));
  } catch (err) {
    console.error("Autocomplete Error:", err.response?.data || err.message);
    throw err;
  }
};

export const getCaptainInTheRadius = async (ltd, lng, radius) => {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/captains/in-the-radius`,
      {
        params: {
          lat: ltd,
          lng,
          radius,
        },
      },
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching captains:", err.message);
    throw err;
  }
};
