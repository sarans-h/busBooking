import React, { useState, useEffect } from 'react';
import { Avatar, Button, Progress, Tooltip } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import Update from './Update';
import { Toaster,toast } from 'react-hot-toast';


const MyProfile = () => {
  const dispatch = useDispatch();
  const [greeting, setGreeting] = useState("Welcome Back");
  const navigate=useNavigate();
  // Load user data from Redux state
  const { loading, error, isAuthenticated, user ,isUpdated} = useSelector((state) => state.user);
  // Dispatch loadUser to fetch user data if it's not already loaded
  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [dispatch, user]);
  // useEffect(()=>{
  //   if(isUpdated){
  //     toast.success('Profile Updated Successfully')
  //   }
  // },[isUpdated])
  // Set greeting based on the time of day
  useEffect(() => { 
    if(user)
      console.log(user)

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);
  const recomend=user?.myBooking
  ?user.myBooking.length>=2
  ?user.myBooking.slice(-2)
  :user.myBooking:
  [];
  console.log(recomend);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col items-center py-12 px-6 text-gray-800 mt-11">
      {/* Main Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-8 space-y-6 md:space-y-0 md:space-x-8">
        
        {/* Left Section - Welcome Message */}
        <div className="flex-1 text-left">
          <div className="flex flex-col md:flex-row items-center">
            <h1 className="text-4xl font-bold mb-2 md:mb-0 flex items-center">
              {greeting}, 
            </h1>
            <h1 className="text-4xl font-bold mb-2 md:ml-2 flex items-center">
              <span className="underline">{user?.name || "User"}!</span>
              <Update/>
            </h1>
          </div>
          {/* <p className="text-lg text-gray-600 mb-4">{user?.role || "Traveler"}</p> */}
          <p className="text-gray-500 mb-6">
            Here’s your travel summary and personalized recommendations to make your next journey memorable.
          </p>
          <div className="flex gap-4">
            <Button auto color="success" rounded onClick={()=>navigate('/bus')}>
              Book New Trip
            </Button>
            {/* <Button auto color="warning" rounded>
              View Offers
            </Button> */}
          </div>
        </div>

        {/* Right Section - Profile Image */}
        <div className="flex justify-center md:justify-end">
          <Avatar
            size="lg"
            src={user?.avatar?.url || "https://i.pravatar.cc/150?img=3"}
            className="mb-6 md:mb-0 hidden md:block"
            bordered
            color="primary"
          />
        </div>
      </div>

      {/* Profile Stats and Loyalty Progress */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Travel Stats ({user?.myBooking.length}/10)</h2>
          <span className="text-gray-600">Level: Gold Member</span>
        </div>
        <Progress
          value={(user?.myBooking.length/10)*100}
          color="success"
          label="Loyalty Progress"
          size="lg"
          rounded
        />
        <p className="text-gray-600 mt-4">
          {(user?.myBooking.length/10)*100} % to your next reward! Book a few more trips to reach Platinum level.
        </p>
      </div>

      {/* Profile Content */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 border border-gray-200 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Trips</h2>
          <div className="space-y-4">

            {user?.myBooking?.length===0?<p>No upcoming trips Book Now!</p>:user?.myBooking?.map((booking, index) => (
              
              <div key={index}>
              {console.log(booking)}
                <h3 className="text-xl font-medium text-blue-700">{booking.from} to {booking.to}</h3>
                <p>Departure: {new Date(booking.journeyDate).toLocaleString()}</p>
              </div>
            )) || (
              <p>No upcoming trips.</p>
            )}
          </div>
        </section>

        <section>
          <Tooltip content="Click to view full history" placement="top-start">
            <h2 className="text-2xl font-semibold mb-4 cursor-pointer" onClick={()=>navigate('/mybookings')}>
              Booking History
            </h2>
          </Tooltip>
          <ul className="space-y-4">
            {user?.myBooking?.length===0?<p>No bookings</p>:user?.myBooking?.map((booking, index) => (
              <li key={index}>
                <h3 className="text-lg font-medium">{booking.from} to {booking.to}</h3>
                <p>Completed on {new Date(booking.journeyDate).toLocaleDateString()}</p>
              </li>
            )) || (
              <p>No past bookings available.</p>
            )}
          </ul>
        </section>

        {recomend.length!==0&&<section>
          <h2 className="text-2xl font-semibold mb-4">Recommended Routes</h2>
          <div className="space-y-4">
            {
              recomend.map((ele,index)=>(
                <div className="flex justify-between items-center" key={index}>
              <h3 className="text-lg font-medium text-yellow-700">{`${ele.from} to ${ele.to}`}</h3>
              <Button auto flat color="warning" rounded onClick={()=>(navigate(`/bus?from=${ele.from}&to=${ele.to}`))}>
                Book Now
              </Button>
              </div>
              ))
            }
            
          </div>
        </section>}
      </div>
      <Toaster/>
    </div>
  );
};

export default MyProfile;
