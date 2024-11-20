import React, { useEffect, useState } from "react";
import axios from "axios"; // Install axios if not already done: `npm install axios`

const Breakup = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/bus/mybuses");
        const busesData = response.data.data
        .filter(bus => bus.numberOfSeats - bus.availableSeats !== 0)
        .map((bus) => ({
          id: bus._id,
          name: bus.name,
          number: bus.busNumber,
          capacity: bus.numberOfSeats,
          type: bus.type,
          availableSeats: bus.availableSeats,
          bookedSeats: bus.numberOfSeats - bus.availableSeats, // Calculate booked seats
        }));
        console.log(busesData);
        
        setBuses(busesData);
      } catch (err) {
        console.error("Error fetching buses:", err);
        setError("Failed to fetch buses.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-14">
      <h1 className="text-2xl font-bold text-center mb-6">Revenue Breakup</h1>
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left py-3 px-4 border-b border-gray-300">Bus Number</th>
                <th className="text-left py-3 px-4 border-b border-gray-300">Seats Booked</th>
                <th className="text-left py-3 px-4 border-b border-gray-300">Occupancy Rate</th>
                {/* <th className="text-left py-3 px-4 border-b border-gray-300">Total Revenue ($)</th> */}
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => {
                const totalRevenue =0
                //  bus.bookedSeats * bus.ticketPrice;
                 const occupancyRate =((bus.bookedSeats / bus.capacity) * 100).toFixed(2);

                return (
                  <tr key={bus.id} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b border-gray-300">{bus.number}</td>
                    <td className="py-3 px-4 border-b border-gray-300">
                      {bus.bookedSeats} / {bus.capacity}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-300">{occupancyRate}%</td>
                    {/* <td className="py-3 px-4 border-b border-gray-300">${totalRevenue}</td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Breakup;
