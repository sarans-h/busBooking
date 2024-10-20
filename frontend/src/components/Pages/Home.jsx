import React, { useState } from 'react';
import s from "../../assets/ben-garratt-0IDGYSVn27U-unsplash.jpg";
import { Button, Link } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';

const Home = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const navigate=useNavigate(); 
  const handleSearch = () => {
    // Navigating to /showBus with query parameters
    navigate(`/bus?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`);
  };
  return (
    <>
      {/* Hero Section */}
      <div
        className="h-[100vh] w-[100%] bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${s})` }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            Book Your Bus With{' '}
            <div className="font-extrabold">RideVerse</div>
          </h1>
          <p className="text-xl mb-6">
            Find the best bus routes and prices for your journey.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-[1.5rem] justify-center mb-8 items-center sm:gap-6">
          <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From"
              className="w-[200px] text-wheat p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#4444441c]/50 backdrop-blur-sm"
              aria-label="Departure city"
            />
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To"
              className="w-[200px] text-wheat p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#4444441c]/50 backdrop-blur-sm"
              aria-label="Destination city"
            />
             <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-[200px] text-wheat p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#4444441c]/50 backdrop-blur-sm"
              aria-label="Departure date"
            />
            
          </div>
          {/* <NavLink to={"/addBus"}>Hello</NavLink> */}
          <Link ></Link>
          <Button onClick={handleSearch}>Find Bus</Button>
        </div>
      </div>
      {/* Features Section */}
      <div className="py-16 px-4 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">Why Ride with Nus?</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="font-semibold text-lg mb-2">Comfortable Seating</h4>
            <p>Enjoy a smooth ride with our premium seating options.</p>
          </div>
          <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="font-semibold text-lg mb-2">Affordable Prices</h4>
            <p>We offer competitive pricing for all routes.</p>
          </div>
          <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="font-semibold text-lg mb-2">Flexible Bookings</h4>
            <p>Book in advance or at the last minute with ease.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-4 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Riders Say</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="font-semibold text-lg mb-2">John Doe</h4>
            <p>"Booking with Nus was fast and easy. Great experience!"</p>
          </div>
          <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="font-semibold text-lg mb-2">Jane Smith</h4>
            <p>"Loved the comfort of the bus ride. Will book again!"</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="py-16 px-4 bg-gray-50 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Book Your Ride?</h2>
        <button className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          Get Started
        </button>
      </div><Toaster containerStyle={{ bottom: 0 }} />
    </>
  );
}

export default Home;
