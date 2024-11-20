
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { allBuses, clearErrors, getBus } from '../../slices/busSlice'; // Adjust the import based on your slice location
import { AiOutlineSearch } from 'react-icons/ai';
import {Pagination} from "@nextui-org/react";
import { Toaster,toast } from 'react-hot-toast';
import { Link, NavLink, useLocation } from 'react-router-dom';
function BusShow() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const journeyDate = searchParams.get('date');
  // console.log(from,to,date);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { buses, loading, error,busescount } = useSelector((state) => state.bus); // Assuming you have a 'buses' slice in Redux
  useEffect(() => {
    console.log("Fetching data for page:", currentPage);
    dispatch(allBuses({keyword, from, to, journeyDate,currentPage })) // Fetch buses on component mount
    if (error) {
      toast.error(error.message);
      dispatch(clearErrors());
    }
  }, [dispatch,from,to,journeyDate,currentPage])

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const sideNavRef = useRef(null);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const duration = (time1, time2) => {
    const diff = Math.abs(new Date(time2) - new Date(time1));
    return `${Math.floor(diff / 3600000)} hours and ${(diff % 3600000) / 60000} minutes`;
  };
  const pricee=(f1,f2)=>{
    return f2-f1
  }
  function handleClickOutside(event) {
    if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
      setIsFilterOpen(false);
    }
  }
  const handleSearch = () => {
    setCurrentPage(1);
  
    dispatch(allBuses({keyword,from,to,journeyDate})); // Fetch buses based on the search keyword
  };

  if (loading) return <p>Loading buses...</p>;
  if (error) return <p>Error fetching buses: {error}</p>;

  return (
    <div className="relative pt-20   px-4 md:px-10 lg:px-28 bg-gradient-to-b min-h-[100vh] to-yellow-200 from-yellow-100 ">
      {/* Filter Button */}
      <button
        onClick={toggleFilter}
        className={`fixed left-4 top-24 px-4 py-2 rounded-md z-30 shadow-md text-black bg-yellow-200 hover:bg-yellow-300 transition ${isFilterOpen ? 'hidden' : ''}`}>
        ☰
      </button>

      {/* Sidebar for Filters */}
      <div
        className={`fixed bottom-0 ${isFilterOpen ? 'left-0' : '-left-full'} h-[91vh]  w-full sm:w-64 bg-yellow-100 shadow-2xl p-6 transition-transform   z-10 duration-1000 ease-in-out  `}
        ref={sideNavRef}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Filters</h2>
          <button
            onClick={toggleFilter}
            className="text-black px-4 py-2 rounded-md bg-yellow-100 hover:bg-yellow-300 transition">
            ✕
          </button>
        </div>

        {/* Filter Options */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Seat Availability</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="ac" className="mr-2" />
              <label htmlFor="ac" className="text-gray-600">AC (33)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="nonac" className="mr-2" />
              <label htmlFor="nonac" className="text-gray-600">Non-AC (12)</label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Arrival Time</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="before6am" className="mr-2" />
              <label htmlFor="before6am" className="text-gray-600">Before 6 am (41)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="6amto12pm" className="mr-2" />
              <label htmlFor="6amto12pm" className="text-gray-600">6 am to 12 pm (3)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="12pmto6pm" className="mr-2" />
              <label htmlFor="12pmto6pm" className="text-gray-600">12 pm to 6 pm (0)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="after6pm" className="mr-2" />
              <label htmlFor="after6pm" className="text-gray-600">After 6 pm (1)</label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Operator</h3>
          <input 
            type="text" 
            placeholder="Operator Name" 
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <button className="bg-yellow-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-500 transition w-full">Apply Filters</button>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-700">Available Buses</h1>
 {/* Search Box */}
 <div className="flex justify-center items-center mb-8">
        <input
          type="text"
          placeholder="Search by Travel name"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="px-4 py-2 border rounded-l-md w-full sm:w-96 focus:ring-2 focus:ring-blue-500 h-[36px]"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-500 text-white px-4 py-2 rounded-r-md hover:bg-yellow-600 transition"
        >
          <AiOutlineSearch size={20} />
        </button>
      </div>
      {/* Main Bus Display */}
      <div className="space-y-4 pb-9 h-full">
        {/* {console.log(buses)} */}
        {buses && buses.length > 0 ? (<>{
          buses.map((bus) => (
            <Link to={`/businfo/${bus._id}`} key={bus._id} onClick={()=>dispatch(getBus(bus._id))}>
              <div key={bus._id} className="border border-gray-300 rounded-lg bg-yellow-50 shadow-lg p-6 mt-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{bus.name}</h2>
                  <p className="text-sm text-gray-500">A/C Seater (2+1)</p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-green-600 font-bold">{bus.rating}</span>
                  <span className="text-xs text-gray-500">{bus.journeyDate.substring(0,10)}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold">{bus.stoppages[0].time.substring(11, 16)}</p>
                  <p className="text-sm text-gray-500">Departure</p>
                </div>
                <div className="text-center">
                  
                  <p className="text-lg font-bold">{bus.stoppages[bus.stoppages.length-1].time.substring(11, 16)}</p>
                  <p className="text-sm text-gray-500">Arrival</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{duration(bus.stoppages[0].time,bus.stoppages[bus.stoppages.length-1].time)}</p>
                  <p className="text-sm text-gray-500">Duration</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">₹{pricee(bus.stoppages[0].fare,bus.stoppages[bus.stoppages.length-1].fare)}</p>
                  <p className="text-sm text-gray-500">Price</p>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <div>Boarding: {from?from:bus.stoppages[0].location}</div>
                <div>Dropping: {to?to:bus.stoppages[bus.stoppages.length-1].location}</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-700">
                  <p className="text-sm">Seats available: <span className="font-bold">{bus.availableSeats}</span></p>
                </div>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">View Seats</button>
              </div>
            </div></Link>
          ))}
          <div className="w-[100%] mx-auto flex relative justify-center bottom-0">
          <Pagination
        total={Math.ceil(busescount / 4)} // Total pages calculated based on bus count
        page={currentPage}
        onChange={(page) => setCurrentPage(page)} // Update `currentPage` on change
        color="warning"
      />
        </div></>
        ) : (
          <div className="h-[90vh]">          <p>No buses available.</p></div>

        )}

        
      </div>

      <Toaster/>
    </div>
  );
}

export default BusShow;
