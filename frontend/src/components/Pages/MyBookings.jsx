import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);

      dispatch(loadUser());
  }, [dispatch]);

  const bookings = user?.myBooking || [];

  return (
    <div className="bg-gray-100 min-h-screen p-10 mt-14">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 py-6 px-10 border-b border-gray-200">
          My Bus Bookings
        </h2>

        {/* Bus booking list */}
        <div className="divide-y divide-gray-200">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div onClick={()=>navigate(`/tick/${booking._id}`)} key={booking._id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition duration-200 cursor-pointer">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700">{`${booking.from} to ${booking.to}`}</h3>
                  <p className="text-gray-500">Bus ID: {booking.busId}</p>
                  <p className="text-gray-500">Booking Time: {new Date(booking.bookingTime).toLocaleString()}</p>
                  <p className="text-gray-500">Seat(s): {booking.seats.join(', ')}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'booked'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'completed'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="p-6 text-gray-500 text-center">No bookings found.</p>
          )}
        </div>
      </div>
      <Toaster containerStyle={{ bottom: 0 }} />
    </div>
  );
};

export default MyBookings;
