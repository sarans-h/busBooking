import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
const Loc = ({ title, children, isVisible }) => {
  return (
    // <div
    //   className={`bg-gray-800 bg-opacity-50 border border-gray-500 rounded-lg p-4 shadow-md h-60 w-60 
    //   transform transition-all duration-500 ease-in-out 
    //   ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
    // >
      <div className="text-white">{children}</div>
    // </div>
  );
};

const Locator = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationByIP = async () => {
      try {
        const response = await fetch(`http://ip-api.com/json/`);
        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }
        const data = await response.json();
        if (data.status === "fail") {
          throw new Error(data.message || "Failed to retrieve location");
        }
        setLocation({ latitude: data.lat, longitude: data.lon });
        setCity(data.city || "Unknown Location");
      } catch (err) {
        setError(err.message || "Could not retrieve location information.");
      }
    };

    fetchLocationByIP();
  }, []);
  const navigate=useNavigate();
  return (
    <div className="flex flex-col items-center mb-10">
      <Loc title="My Locator" isVisible={true}>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : location ? (
            <>
            <p>Book bus from your city </p>
            <span 
  onClick={city !== "unknown" ? () => navigate(`/bus?from=${city}&to=&date=`) : undefined} 
  className={`cursor-pointer ${city === "Unknown Location" ? "text-gray-500 no-underline cursor-not-allowed" : "underline"} text-l mb-4`}
>
  {city}
  <FaLocationDot className="inline"/>
</span>
            </>
          
        ) : (
          <p>Fetching location...</p>
        )}
      </Loc>
    </div>
  );
};

export default Locator;
