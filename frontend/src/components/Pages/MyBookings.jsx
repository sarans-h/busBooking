import React from 'react';
import { Toaster } from 'react-hot-toast';

const MyBookings = () => {
  // Hardcoded bus booking data
  const bookings = [
    {
      id: 1,
      route: 'New York to Washington D.C.',
      departureTime: '2024-10-15 10:00 AM',
      arrivalTime: '2024-10-15 03:00 PM',
      price: '$50',
      seatNumber: '12A',
      busCompany: 'Speedy Travels',
      status: 'Completed',
    },
    {
      id: 2,
      route: 'San Francisco to Los Angeles',
      departureTime: '2024-11-03 08:00 AM',
      arrivalTime: '2024-11-03 01:00 PM',
      price: '$45',
      seatNumber: '7B',
      busCompany: 'Comfort Rides',
      status: 'Completed',
    },
    {
      id: 3,
      route: 'Boston to New York',
      departureTime: '2024-12-12 06:00 PM',
      arrivalTime: '2024-12-12 11:00 PM',
      price: '$40',
      seatNumber: '15C',
      busCompany: 'Luxury Lines',
      status: 'Cancelled',
    },
    {
      id: 4,
      route: 'Las Vegas to Phoenix',
      departureTime: '2025-01-05 09:00 AM',
      arrivalTime: '2025-01-05 02:00 PM',
      price: '$60',
      seatNumber: '9D',
      busCompany: 'Speedy Travels',
      status: 'Confirmed',
    },
  ];

  // Sort bookings by departureTime (latest first)
  const sortedBookings = bookings.sort((a, b) => new Date(b.departureTime) - new Date(a.departureTime));

  return (
    <div className="bg-gray-100 min-h-screen p-10 mt-14">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 py-6 px-10 border-b border-gray-200">
          My Bus Bookings
        </h2>

        {/* Bus booking list */}
        <div className="divide-y divide-gray-200">
          {sortedBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition duration-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">{booking.route}</h3>
                <p className="text-gray-500">Bus Company: {booking.busCompany}</p>
                <p className="text-gray-500">Departure: {booking.departureTime}</p>
                <p className="text-gray-500">Arrival: {booking.arrivalTime}</p>
                <p className="text-gray-500">Seat: {booking.seatNumber}</p>
              </div>

              <div className="text-right">
                <p className="text-lg font-medium text-gray-700">{booking.price}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'Completed'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div><Toaster containerStyle={{ bottom: 0 }} />
    </div>
  );
};

export default MyBookings;
