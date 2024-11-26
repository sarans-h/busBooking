import React, { useState } from 'react';
import s from "../../assets/ben-garratt-0IDGYSVn27U-unsplash.jpg";
import { Button, Link } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import Locator from './Locator';

const Home = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const navigate=useNavigate(); 
  const handleSearch = () => {
    // Navigating to /showBus with query parameters
    console.log(`/bus?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`);

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
          <div className="z-30">
        <Locator title={"saransh"} children={"sa"}/>

        </div>

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
      <div className="py-16 px-12 bg-gradient-to-b  to-yellow-100 from-yellow-50">
        <h2 className="text-4xl font-bold text-center mb-12">Why Ride with Us?</h2>
        <div className="flex flex-wrap justify-center gap-6">
        <div className="flex flex-wrap justify-between gap-4">
  <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
    <div className="flex items-center mb-2">
      <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M2 12l1.41-1.41L12 1.83l8.59 8.76L22 12l-10 10L2 12z"/>
      </svg>
      <h4 className="font-semibold text-lg">Comfortable Seating</h4>
    </div>
    <p>Enjoy a smooth ride with our premium seating options.</p>
  </div>

  <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
    <div className="flex items-center mb-2">
      <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 12l1.41 1.41L12 6.83l7.59 7.59L21 12l-9-9-9 9z"/>
      </svg>
      <h4 className="font-semibold text-lg">Affordable Prices</h4>
    </div>
    <p>We offer competitive pricing for all routes.</p>
  </div>

  <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
    <div className="flex items-center mb-2">
      <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-4h2v4zm0-6h-2V7h2v5z"/>
      </svg>
      <h4 className="font-semibold text-lg">Flexible Bookings</h4>
    </div>
    <p>Book in advance or at the last minute with ease.</p>
  </div>

  <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
    <div className="flex items-center mb-2">
      <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
      <h4 className="font-semibold text-lg">Convenient Locations</h4>
    </div>
    <p>Our services are available at numerous accessible locations.</p>
  </div>

  <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
  <div className="flex items-center mb-2">
    <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 00-10 10v4a3 3 0 003 3h1v-2H5a1 1 0 01-1-1v-4a8 8 0 1116 0v4a1 1 0 01-1 1h-1v2h1a3 3 0 003-3v-4a10 10 0 00-10-10zM8 14a1 1 0 000 2h2v-2H8zm6 0v2h2a1 1 0 000-2h-2z"/>
    </svg>
    <h4 className="font-semibold text-lg">24/7 Customer Support</h4>
  </div>
  <p>Reach out to our support team anytime, day or night.</p>
</div>

  <div className="w-full sm:w-[30%] p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
    <div className="flex items-center mb-2">
      <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <h4 className="font-semibold text-lg">Safety First</h4>
    </div>
    <p>Your safety is our top priority with well-maintained vehicles and trained drivers.</p>
  </div>

 
</div>

        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-4 bg-gradient-to-b from-yellow-100 to-white">
  
  <h2 className="text-4xl font-bold text-center mb-12">What Our Riders Say </h2>
  <span className='font-bold text-center mb-12'>
  <h3>These reviews are coming from my 3rd party reviw provide prject</h3>
    </span>
  <div className="flex flex-wrap justify-center gap-6">
    <div className="w-full sm:w-[30%] p-6 h-60 border border-gray-300 rounded-lg shadow-md bg-transparent">
      <div className="flex items-center mb-3">
        <img src="https://via.placeholder.com/40" alt="John Doe" className="w-10 h-10 rounded-full mr-3"/>
        <h4 className="font-semibold text-lg">John Doe</h4>
      </div>
      <p className="text-gray-600">"Booking with Nus was fast and easy. Great experience!"</p>
      <div className="flex items-center mt-4">
        <span className="text-yellow-500">&#9733;</span>
        <span className="text-yellow-500">&#9733;</span>
        <span className="text-yellow-500">&#9733;</span>
        <span className="text-yellow-500">&#9733;</span>
        <span className="text-yellow-500">&#9734;</span>
      </div>
    </div>

    <div className="w-full sm:w-[30%] p-6 h-60 border border-gray-300 rounded-lg shadow-md bg-transparent">
      <div className="flex items-center mb-3">
        <img src="https://via.placeholder.com/40" alt="Jane Smith" className="w-10 h-10 rounded-full mr-3"/>
        <h4 className="font-semibold text-lg">Jane Smith</h4>
      </div>
      <p className="text-gray-600">"Loved the comfort of the bus ride. Will book again!"</p>
      <div className="flex items-center mt-4">
        <span className="text-yellow-500">&#9733;</span>
        <span className="text-yellow-500">&#9733;</span>
        <span className="text-yellow-500">&#9733;</span>
        <span className="text-yellow-500">&#9733;</span>
        <span className="text-yellow-500">&#9733;</span>
      </div>
    </div>
  </div>
</div>

      {/* Call-to-Action Section */}
     <Toaster containerStyle={{ bottom: 0 }} />
    </>
  );
}

export default Home;
