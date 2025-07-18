// import dotenv from 'dotenv';
// dotenv.config();
// import axios from "axios";
// import captainModel from "../models/captain.model.js";
// const ORS_API_KEY = process.env.ORS_API_KEY; // Get API key from OpenRouteService

// // Function to get latitude and longitude from an address using OpenStreetMap (Nominatim)
// export const getAddressCoordinate = async (address) => {
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

//     try {
//         const response = await axios.get(url, {
//             headers: { "User-Agent": "Uber" } // Required by Nominatim
//         });

//         if (response.data.length > 0) {
//             const location = response.data[0];
//             return {
//                 lat: parseFloat(location.lat),
//                 lng: parseFloat(location.lon)
//             };
//         } else {
//             throw new Error(`Failed to fetch coordinates for: ${address}`);
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };
// console.log("ORS API Key:", process.env.ORS_API_KEY);

// // Function to get distance and travel time between two addresses
// export const getDistanceAndTime = async (originName, destinationName) => {
//     try {
//         // Fetch coordinates for origin and destination
//         const origin = await getAddressCoordinate(originName);
//         const destination = await getAddressCoordinate(destinationName);

//         const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`;

//         const response = await axios.get(url);
//         //  const response = await axios.get(url, {
//         //     headers: {
//         //         Authorization: process.env.ORS_API_KEY, // ✅ Correct place
//         //     },
//         // });

//         if (response.data.routes.length > 0) {
//             const route = response.data.routes[0];
//             return {
//                 origin: originName,
//                 destination: destinationName,
//                 distance_km: route.summary.distance / 1000, // Convert meters to km
//                 duration_min: route.summary.duration / 60, // Convert seconds to minutes
//                 origin_coords: origin,
//                 destination_coords: destination
//             };
//         } else {
//             throw new Error("Failed to fetch distance and time");
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// // Function to get autocomplete suggestions for addresses
// export const getAutoCompleteSuggestionservice = async (req, res) => {
//     try {
//         const { query } = req.query; // Extract query from request

//         if (!query) {
//             return res.status(400).json({ error: "Query parameter is required" });
//         }

//         const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;

//         const response = await axios.get(url, {
//             headers: { "User-Agent": "Uber" } // Required by Nominatim
//         });

//         if (response.data.length > 0) {
//             const suggestions = response.data.map((place) => ({
//                 display_name: place.display_name,
//                 lat: parseFloat(place.lat),
//                 lng: parseFloat(place.lon),
//             }));

//             return res.json({ suggestions });
//         } else {
//             return res.status(404).json({ message: "No suggestions found" });
//         }
//     } catch (error) {
//         console.error("Autocomplete error:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };


// export const getCaptainInTheRadius = async (ltd , lng , radius)=>{
//     const captains  = await captainModel.find({
//         location:{
//             $geoWithin:{
//                 $centerSphere:[[lng , ltd] , radius / 6378.1]
//             }
//         }
//     });

//     return captains
// }


import dotenv from 'dotenv';
dotenv.config();
import axios from "axios";
import captainModel from "../models/captain.model.js";

// Haversine formula to calculate distance between two points
const haversineDistance = (coords1, coords2) => {
    const toRadians = (deg) => (deg * Math.PI) / 180;

    const R = 6371; // Radius of Earth in km
    const dLat = toRadians(coords2.lat - coords1.lat);
    const dLon = toRadians(coords2.lng - coords1.lng);

    const lat1 = toRadians(coords1.lat);
    const lat2 = toRadians(coords2.lat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Nominatim to get coordinates from address
export const getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url, {
            headers: { "User-Agent": "UberAppFree" }
        });

        if (response.data.length > 0) {
            const location = response.data[0];
            return {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon)
            };
        } else {
            throw new Error(`Failed to fetch coordinates for: ${address}`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Get distance and time using haversine + fixed average speed
export const getDistanceAndTime = async (originName, destinationName) => {
    try {
        const origin = await getAddressCoordinate(originName);
        const destination = await getAddressCoordinate(destinationName);

        const distance_km = haversineDistance(origin, destination);

        const avgSpeedKmph = 40; // Estimated average city speed
        const duration_min = (distance_km / avgSpeedKmph) * 60;

        return {
            origin: originName,
            destination: destinationName,
            distance_km: parseFloat(distance_km.toFixed(2)),
            duration_min: parseFloat(duration_min.toFixed(2)),
            origin_coords: origin,
            destination_coords: destination
        };
    } catch (error) {
        console.error("Distance/Time Error:", error);
        throw error;
    }
};

// Autocomplete using Nominatim
export const getAutoCompleteSuggestionservice = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;

        const response = await axios.get(url, {
            headers: { "User-Agent": "UberAppFree" }
        });

        if (response.data.length > 0) {
            const suggestions = response.data.map((place) => ({
                display_name: place.display_name,
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon),
            }));

            return res.json({ suggestions });
        } else {
            return res.status(404).json({ message: "No suggestions found" });
        }
    } catch (error) {
        console.error("Autocomplete error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get captains within radius
export const getCaptainInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, ltd], radius / 6378.1]
            }
        }
    });

    return captains;
};
