import axios from 'axios';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadUser } from '../../slices/userSlice';

const Ticket = () => {
  const { loading, error, isAuthenticated, user ,isUpdated} = useSelector((state) => state.user);

  const { bookingId } = useParams();
  const dispatch= useDispatch();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    dispatch(loadUser());
  }, []);
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/api/v1/book/tick/${bookingId}`);
        console.log(response.data);
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (!booking) return <p className="text-center text-gray-500">Loading ticket details...</p>;

  const { userId, bus, bookingTime, status } = booking;
  const qrData = JSON.stringify(bookingId);

  return (
    <div className="flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto border border-gray-200 mt-[7.5rem]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ticket for Booking</h2>
      
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">User ID:</span> {userId}
      </p>
      
      <div className="text-gray-600 mb-2">
        <span className="font-semibold">Bus Name:</span> {bus.name}
      </div>
      
      <div className="text-gray-600 mb-2">
        <span className="font-semibold">Bus Number:</span> {bus.busNumber}
      </div>
      
      <div className="text-gray-600 mb-2">
        <span className="font-semibold">Seats:</span>
        <ul className="ml-4 list-disc list-inside">
          {bus.seats.map((seat, index) => (
            <li key={index} className="text-gray-600">
              <span className="font-semibold">Seat Number:</span> {seat.seatNumber} 
            </li>
          ))}
        </ul>
      </div>
      
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Booking Time:</span> {new Date(bookingTime).toLocaleString()}
      </p>
      
      <p className={`text-gray-600 mb-4 ${status === 'booked' ? 'text-green-500' : 'text-red-500'}`}>
        <span className="font-semibold">Status:</span> {status.charAt(0).toUpperCase() + status.slice(1)}
      </p>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <QRCode value={qrData} size={128} />
      </div>

      <p className="text-gray-500">Scan this QR code for your booking details.</p>
    </div>
  );
};

export default Ticket;
