import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams , useNavigate} from 'react-router-dom'
import { getBus } from '../../slices/busSlice';

const Test = () => {
    const { busId } = useParams();
    console.log(busId)
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const { bus, loading } = useSelector((state) => state.bus);
    const [busData, setBusData] = useState(bus);
 // Fetch the bus details on mount or reload
 useEffect(() => {
    if (busId) {
      console.log("Dispatching getBus on mount or reload");
      dispatch(getBus(busId));
    }
  }, [dispatch, busId]);

  // Update busData when bus from Redux store changes
  useEffect(() => {
    if (bus) {
      setBusData(bus);
    }
  }, [bus]); // Add 'bus' to dependency array
    console.log(busData.name);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const amenities = ['Wi-Fi', 'Air Conditioning', 'Restroom'];
    const policies = [
        'Mask required throughout the journey',
        'No smoking or alcohol on board',
        'Baggage limit: 2 bags per passenger',
    ];
    const handleSeatClick = (seat) => {
        if (seat.isBooked) return; // Don't allow selecting already booked seats  
        if (selectedSeats.includes(seat._id)) {
            setSelectedSeats(selectedSeats.filter((id) => id !== seat._id));
        } else {
            setSelectedSeats([...selectedSeats, seat._id]);
        }
    };

    return (
        <>
            {
                loading ? <>Loading</> :
                <div className="bg-gray-100 p-10 min-h-screen mt-16">
                <div className="flex flex-col md:flex-row justify-between mb-10">
                    <div className="md:w-1/2 w-full mb-8 md:mb-0">
                        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Seat Availability</h2>
            
                        {/* Seat Layout */}
                        <div className="">
                            <div className="flex justify-center">
                                <div className="flex gap-8">
                                    {/* Left Seats */}
                                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                        {busData?.seats?.slice(0, 14).map((seat) => (
                                            <div
                                                key={seat._id}
                                                onClick={() => handleSeatClick(seat)}
                                                className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex flex-col items-center justify-center rounded-lg border-2 text-white font-bold text-xs sm:text-sm lg:text-base p-4 sm:p-2 cursor-pointer ${
                                                    seat.isBooked
                                                        ? 'bg-black border-black'
                                                        : selectedSeats.includes(seat._id)
                                                        ? 'bg-blue-500 border-blue-600'
                                                        : 'bg-green-500 border-green-600'
                                                }`}
                                            >
                                                {seat.seatNumber}
                                                <span className="text-[10px] sm:text-xs lg:text-sm mt-1">${seat.fare || 100}</span>
                                            </div>
                                        ))}
                                    </div>
            
                                    {/* Aisle */}
                                    <div className="w-5 sm:w-10"></div>
            
                                    {/* Right Seats */}
                                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                        {busData?.seats?.slice(14, 28).map((seat) => (
                                            <div
                                                key={seat._id}
                                                onClick={() => handleSeatClick(seat)}
                                                className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex flex-col items-center justify-center rounded-lg border-2 text-white font-bold text-xs sm:text-sm lg:text-base p-4 sm:p-2 cursor-pointer ${
                                                    seat.isBooked
                                                        ? 'bg-black border-black'
                                                        : selectedSeats.includes(seat._id)
                                                        ? 'bg-blue-500 border-blue-600'
                                                        : 'bg-green-500 border-green-600'
                                                }`}
                                            >
                                                {seat.seatNumber}
                                                <span className="text-[10px] sm:text-xs lg:text-sm mt-1">${seat.fare || 100}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
            
                            {/* Last Row Seats */}
                            <div className="mt-4 flex justify-center">
                                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                    {busData?.seats?.slice(28).map((seat) => (
                                        <div
                                            key={seat._id}
                                            onClick={() => handleSeatClick(seat)}
                                            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex flex-col items-center justify-center rounded-lg border-2 text-white font-bold text-xs sm:text-sm lg:text-base p-4 sm:p-2 cursor-pointer ${
                                                seat.isBooked
                                                    ? 'bg-black border-black'
                                                    : selectedSeats.includes(seat._id)
                                                    ? 'bg-blue-500 border-blue-600'
                                                    : 'bg-green-500 border-green-600'
                                            }`}
                                        >
                                            {seat.seatNumber}
                                            <span className="text-[10px] sm:text-xs lg:text-sm mt-1">${seat.fare || 100}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
            
                        {/* Book Seats Button for Small Screens */}
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
            
                    {/* Bus Info (Currently Hidden) */}
                   <div className="md:w-1/2 w-full md:pl-10">
                        <h1 className="text-4xl font-bold mb-4 text-blue-600">{busData.name}</h1>
                         <div className="text-lg text-gray-700 space-y-2">
                        
                            <p><strong>Driver:</strong> {busData?.driver?.name}</p>
                             <p><strong>Driver Contact:</strong> {busData?.driver?.contact}</p>
                            <p><strong>Bus Number:</strong> {busData?.busNumber}</p>
                            <p><strong>Route:</strong> {busData?.stoppages?.map(stop => stop.location).join(' - ')}</p>
                            <p><strong>Bus Type:</strong> {busData?.type}</p>
                            <p><strong>Amenities:</strong> {busData?.features?.join(', ')}</p>
                            <p><strong>Departure Time:</strong> {new Date(busData?.startTime).toLocaleString()}</p>
                            <p><strong>Estimated Arrival:</strong>  {
    busData?.stoppages?.length > 0
      ? new Date(busData.stoppages[busData.stoppages.length - 1]?.time)?.toLocaleString()
      : 'N/A'  // Provide a fallback if stoppages is empty or undefined
  }</p>
                            <p><strong>Total Duration:</strong> {busData?.duration || '3 hours'}</p>
                            <p><strong>Ticket Price:</strong> {busData?.price || 100}</p>
                        </div> 
                        <div className="text-center mt-8 hidden md:flex  ">
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg text-lg hover:bg-blue-700 disabled:bg-gray-300"
                        disabled={selectedSeats.length === 0}
                        onClick={() => alert(`Seats booked: ${selectedSeats.join(', ')}`)}
                    >
                        Book Selected Seats
                    </button>
                </div>
                    </div> 
            
                </div>
            
                {/* Book Seats Button for Large Screens */}
                
            </div>
            

            }</>

    )
}

export default Test