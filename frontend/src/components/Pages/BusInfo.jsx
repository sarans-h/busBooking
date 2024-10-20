import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBus } from '../../slices/busSlice';
import { useDispatch } from 'react-redux';

const BusInfo = () => {
  const {busId}=useParams();
  const dispatch = useDispatch();
  useEffect(()=>{
    console.log(busId);
    
    dispatch(getBus(busId));


  },[]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const amenities= ['Wi-Fi', 'Air Conditioning', 'Restroom'];
  const policies= [
    'Mask required throughout the journey',
    'No smoking or alcohol on board',
    'Baggage limit: 2 bags per passenger',
  ];
  const bus = {
    company: 'Speedy Travels',
    driver: 'John Doe',
    driverContact: '+1 (555) 123-4567',
    route: 'New York to Washington D.C.',
    busType: 'Luxury Coach',
 
    departureTime: '10:00 AM', 
    estimatedArrival: '3:00 PM',
    price: '$50',
    duration: '5 hours',
   
    seats: [
      { id: 1, available: true, price: '$50' },
      { id: 2, available: false, price: '$50' },
      { id: 3, available: true, price: '$50' },
      { id: 4, available: true, price: '$50' },
      { id: 5, available: false, price: '$50' },
      { id: 6, available: true, price: '$50' },
      { id: 7, available: true, price: '$50' },
      { id: 8, available: false, price: '$50' },
      { id: 9, available: true, price: '$50' },
      { id: 10, available: true, price: '$50' },
      { id: 11, available: false, price: '$50' },
      { id: 12, available: true, price: '$50' },
      { id: 13, available: true, price: '$50' },
      { id: 14, available: false, price: '$50' },
      { id: 15, available: true, price: '$50' },
      { id: 16, available: true, price: '$50' },
      { id: 17, available: false, price: '$50' },
      { id: 18, available: true, price: '$50' },
      { id: 19, available: true, price: '$50' },
      { id: 20, available: false, price: '$50' },
    ],
  };

  const handleSeatClick = (seat) => {
    if (!seat.available) return; // Don't allow selecting already booked seats
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  return (
    <div className="bg-gray-100 p-10 min-h-screen mt-16">
      {/* Main Content: Flex to align left and right sections */}
      <div className="flex flex-col md:flex-row justify-between mb-10">
        {/* Right Side: Seats Layout */}
        <div className="md:w-1/2 w-full mb-8 md:mb-0">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Seat Availability</h2>

          {/* Aisle and Layout Representation */}
          <div className="flex justify-center">
            <div className="flex gap-8">
              {/* Left Seats */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {bus.seats.slice(0, 10).map((seat) => (
                  <div
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex flex-col items-center 
                      justify-center rounded-lg border-2 text-white font-bold text-xs sm:text-sm lg:text-base p-4 sm:p-2 cursor-pointer ${
                      seat.available
                        ? selectedSeats.includes(seat.id)
                          ? 'bg-blue-500 border-blue-600'
                          : 'bg-green-500 border-green-600'
                        : 'bg-black border-black'
                    }`}
                  >
                    {seat.id}
                    <span className="text-[10px] sm:text-xs lg:text-sm mt-1">${seat.price}</span>
                  </div>
                ))}
              </div>

              {/* Aisle */}
              <div className="w-5 sm:w-10"></div>

              {/* Right Seats */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {bus.seats.slice(10).map((seat) => (
                  <div
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex flex-col items-center 
                      justify-center rounded-lg border-2 text-white font-bold text-xs sm:text-sm lg:text-base p-4 sm:p-2 cursor-pointer ${
                      seat.available
                        ? selectedSeats.includes(seat.id)
                          ? 'bg-blue-500 border-blue-600'
                          : 'bg-green-500 border-green-600'
                        : 'bg-black border-black'
                    }`}
                  >
                    {seat.id}
                    <span className="text-[10px] sm:text-xs lg:text-sm mt-1">${seat.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Book Seats Button below seat layout for small screens */}
          <div className="text-center mt-8 md:hidden">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg text-lg hover:bg-blue-700 disabled:bg-gray-300"
              disabled={selectedSeats.length === 0}
              onClick={() => alert(`Seats booked: ${selectedSeats.join(', ')}`)}
            >
              Book Selected Seats
            </button>
          </div>
        </div>

        {/* Left Side Information */}
        <div className="md:w-1/2 w-full md:pl-10">
          <h1 className="text-4xl font-bold mb-4 text-blue-600">{bus.company}</h1>
          <div className="text-lg text-gray-700 space-y-2">
            <p><strong>Driver:</strong> {bus.driver}</p>
            <p><strong>Driver Contact:</strong> {bus.driverContact}</p>
            <p><strong>Route:</strong> {bus.route}</p>
            <p><strong>Bus Type:</strong> {bus.busType}</p>
            <p><strong>Amenities:</strong> {amenities.join(', ')}</p>
            <p><strong>Departure Time:</strong> {bus.departureTime}</p>
            <p><strong>Estimated Arrival:</strong> {bus.estimatedArrival}</p>
            <p><strong>Duration:</strong> {bus.duration}</p>
            <p><strong>Ticket Price:</strong> {bus.price}</p>
          </div>
        </div>
      </div>

      {/* Book Seats Button for medium to large screens */}
      <div className="text-center mt-8 hidden md:block">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg text-lg hover:bg-blue-700 disabled:bg-gray-300"
          disabled={selectedSeats.length === 0}
          onClick={() => alert(`Seats booked: ${selectedSeats.join(', ')}`)}
        >
          Book Selected Seats
        </button>
      </div>

      {/* Information Below the Seats */}
      <div className="mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Policies Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full md:w-1/2">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Policies</h3>
            <ul className="list-disc pl-5 space-y-1 text-lg text-gray-600">
              {policies.map((policy, index) => (
                <li key={index}>{policy}</li>
              ))}
            </ul>
          </div>

          {/* Amenities Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full md:w-1/2">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Amenities</h3>
            <ul className="list-disc pl-5 space-y-1 text-lg text-gray-600">
              {amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional Information */}
        <div className="text-center mt-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Additional Details</h3>
          <p className="text-lg text-gray-600 mb-2">
            Please arrive at least 15 minutes before departure to ensure a smooth boarding process.
          </p>
          <p className="text-lg text-gray
600">
            For more information, contact us at: info@speedytravels.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusInfo;
