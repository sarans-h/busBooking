import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'
import { getBus } from '../../slices/busSlice';
import axios from 'axios';
import io from 'socket.io-client';
import { clearErrors, loadUser } from '../../slices/userSlice';
import toast, { Toaster } from 'react-hot-toast';
const socket = io('http://localhost:8080');
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const BusInfo = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { busId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bus, loading } = useSelector((state) => state.bus);
  const [busData, setBusData] = useState(bus);
  const [fare, setFare] = useState(0);
  const [fromStop, setFromStop] = useState(''); // Selected From stop
  const [toStop, setToStop] = useState(''); // Selected To stop
  const [filteredToStops, setFilteredToStops] = useState([]);
  const [viewingUsers, setViewingUsers] = useState(0); // Number of users currently viewing
  const { user,error } = useSelector((state) => state.user);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [mySelectedSeats, setMySelectedSeats] = useState([]); // Seats selected by the current user
  const [userId, setUserId] = useState(); // Store userId after connecting
  const [s, setS] = useState([])
  // const userId=user._id
  // console.log(userId)


  // Fetch the bus details on mount or reload
  useEffect(() => {
    if(error){
      // console.log(error)
      if(error==='Please Login to access this')
      toast.error(error+' or book seats');
      // else if(error==='Request failed with status code 500')
      //   console.log("sjhg");

      else toast.error(error);
    
    }
    if (user && user._id)
      setUserId(user._id);
  }, [user,error])
  useEffect(() => {
    // dispatch(loadUser())

    const fetchSeats = async () => {
      try {
        const response = await axios.get(`/fetchseats/${busId}`);

        // console.(response); // Log the entire response object
        // console.log(response.data); // Log response data (should contain seats)
        // console.log(response.data.seats);
        setS(response.data.seats)
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };
    fetchSeats();

    socket.on('connect', () => {
      console.log('Connected to the server!');
      // console.log(userId)
      // setUserId(user._id)
      // Set userId as the socket.id\
    });
    socket.emit('joinBus', { busId });

    // Listen for initial data from the server
    socket.on('initialData', (data) => {
      setSelectedSeats(data.selectedSeats); // Set all currently selected seats
      setViewingUsers(data.viewingUsers); // Update viewing users on initial load
    });

    socket.on('viewingUsersUpdate', (data) => {
      setViewingUsers(data.viewingUsers); // Update viewing users in real-time
    });

    // Listen for updates when users select/deselect seats
    socket.on('seatUpdate', (data) => {
      setSelectedSeats(data.selectedSeats); // Update seat selection in real-time
    });

    return () => {
      socket.off('connect');
      socket.off('initialData');
      socket.off('seatUpdate');
      socket.off('viewingUsersUpdate');
    };
  }, []);
  useEffect(() => {
    if (busId) {
      // console.log("Dispatching getBus on mount or reload");
      dispatch(getBus(busId));
    }
  }, [dispatch, busId]);

  // Update busData when bus from Redux store changes
  useEffect(() => {
    if (bus) {
      setBusData(bus);
    }
  }, [bus]); // Add 'bus' to dependency array

  const handleFromChange = (e) => {
    const selectedFromStop = e.target.value;
    setFromStop(selectedFromStop);

    // Find the index of the selected From stop
    const fromIndex = busData.stoppages.findIndex(stop => stop.location === selectedFromStop);

    // Filter To stops to only include those after the From stop
    const availableToStops = busData.stoppages.slice(fromIndex + 1);
    setFilteredToStops(availableToStops);

    // Reset To stop when From stop changes
    setToStop('');
  };

  // Handle To stop change
  const handleToChange = (e) => {
    setToStop(e.target.value);
  };

  const handleSeatSelect = (seatNumber) => {
   
    const seat = selectedSeats.find(seat => seat.seatNumber === seatNumber);

    if (seat && seat.userId !== userId) {
      // If the seat is selected by another user, prevent action
      console.log('inside if');

      return;
    }
    else if (mySelectedSeats.includes(seatNumber)) {
      console.log('inside elseif');

      // Deselect the seat if it was selected by this user
      const updatedSeats = mySelectedSeats.filter(seat => seat !== seatNumber);
      setMySelectedSeats(updatedSeats);
      socket.emit('seatDeselected', { seatNumber, userId, busId });
    } else {
      console.log('inside else');

      // Select a new seat if it is available
      const updatedSeats = [...mySelectedSeats, seatNumber];
      setMySelectedSeats(updatedSeats);
      socket.emit('seatSelected', { seatNumber, userId, busId });
    }




  };
  useEffect(() => {
    console.log('SelectedSeats updated:', selectedSeats);

    console.log('mySelectedSeats updated:', mySelectedSeats);
  }, [mySelectedSeats, selectedSeats]);
  const isSeatDisabled = (seatNumber) => {
    // Disable seat if it is selected by someone else
    const seat = selectedSeats.find(seat => seat.seatNumber === seatNumber);
    return seat && seat.userId !== userId;
  };
  const handlebook=async()=>{
    if (!stripe || !elements) {
      alert('Stripe is not loaded!');
      return;
    }
    const cardElement = elements.getElement(CardElement);

    if(!user){
      return toast.error('Login to Book seats')
    }
    setPaymentLoading(true); 
  // Map over mySelectedSeats to create seat updates
  const seatUpdates = mySelectedSeats.map((seatNo) => {
    const seat = s.find((s) => s.seatNumber === seatNo);
    // console.log(s);
    return {
      seatId: seat ? seat._id : null, // Find the seatId corresponding to the seatNo
      bookedBy: userId, // Replace "John" with dynamic user information if needed
    };
  }).filter(update => update.seatId); // Filter out any null seatId

  // Construct the final object
  if(toStop===''||fromStop===''){
    toast.error("Please select to and from stops.");
    return;
  }
  const journeyDate=busData.journeyDate;
  const { paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });
  const payload = {
    seatUpdates,
    userId,
    busId,
    fromStop,
    toStop,
    journeyDate,
    paymentMethodId:paymentMethod.id,
  };
  try {
    const response = await axios.post('/api/v1/book/m', payload);
  
    if (response.data.success) {
      const clientSecret = response.data.clientSecret;

      // Confirm payment using Stripe
      const confirmPayment = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${user.name}`, // Add customer details if available
          },
        },
      });
      
      
      if (confirmPayment.paymentIntent?.status === 'succeeded') {
        toast.success('Payment successful!');
        navigate(`/tick/${response.data.bookingId}`);
      } else {
        toast.error('Payment failed, please try again.');
      }
    } else {
      toast.error('Booking failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    toast.error('Something went wrong. Please try again.');
  }finally{
    setPaymentLoading(false)
  }
  

}
useEffect(()=>{
  const calculateFare = (from, to) => {
    
    
    if (!from || !to || !busData.stoppages) {
        setFare(0);
        return;
    }

    const { stoppages } = busData;
    console.log(busData);

    const fromIndex = stoppages.findIndex((stop) => stop.location === from);
    const toIndex = stoppages.findIndex((stop) => stop.location === to);

    if (fromIndex === -1 || toIndex === -1) {
        setFare(0); // Locations not found
        return;
    }

    // Ensure fare is calculated only if "to" comes after "from"
    if (fromIndex < toIndex) {
        const totalFare = (stoppages[toIndex].fare - stoppages[fromIndex].fare)*mySelectedSeats.length;
        setFare(totalFare);
    } else {
        setFare(0); // No valid route
    }
}; 
calculateFare(fromStop,toStop,mySelectedSeats)

},[fromStop,toStop,mySelectedSeats]);
  return (
    <>
      {
        loading ? <>Loading</> :
          <div className="bg-gray-100 p-10 min-h-screen mt-16">
            <div className="flex flex-col md:flex-row justify-between mb-10">{
              <div className='text-center'>
          <h1 className="text-4xl font-bold mb-4 text-center text-blue-600">Select Boarding and Dropping point</h1>

          {/* From Dropdown */}
          <div className="mb-4">
  
            <label htmlFor="from" className="block mb-2 text-xl  font-semibold">From:</label>
            <select
              id="from"
              value={fromStop}
              onChange={handleFromChange}
              className="border p-2 rounded"
            >
              <option value="" disabled>Select departure stop</option>
              {busData?.stoppages?.map((stop, index) => (
                <option key={index} value={stop.location}>{stop.location} </option>
              ))}
            </select>
          </div>

          {/* To Dropdown */}
          <div className="mb-4">
            <label htmlFor="to" className="block mb-2 font-semibold text-xl ">To:</label>
            <select
              id="to"
              value={toStop}
              onChange={handleToChange}
              disabled={!fromStop}
              className="border p-2 rounded"
            >
              <option value="" disabled>Select destination stop</option>
              {filteredToStops.map((stop, index) => (
                <option key={index} value={stop.location}>{stop.location}</option>
              ))}
            </select>
          </div>
          <div className="h-60 flex flex-col justify-evenly">

          <h1>
  Booking for {`${new Date(busData.journeyDate).toDateString()} departuring at ${new Date(busData.journeyDate).toLocaleTimeString("en-GB").substring(0,5)}`}
</h1>
<CardElement
  options={{
    hidePostalCode: true,
    style: {
      base: {
        fontSize: '18px', // Increase font size
        height: '50px', // Increase height
        color: '#424770',
        '::placeholder': { color: '#aab7c4' },
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }}
  className="mb-4 p-3 border border-gray-300 rounded-lg shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  id="card-element"
/>
  </div>

          {/* Other Information or Actions */}
          {/* Rest of your component code here */}
        </div>

            }
              <div className="md:w-1/2 w-full mb-8 md:mb-0">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Seat Availability</h2>

                {/* Seat Layout */}
                <div className="">
                  <div className="flex justify-center">
                    <div className="flex gap-8">
                      {/* Left Seats */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        {/* {console.log(s)} */}
                        {s?.slice(0, 14)?.map((seat) => (
                           (<button
                            key={seat._id}
                            onClick={() => handleSeatSelect(seat.seatNumber)}
                            disabled={seat.isBooked||isSeatDisabled(seat.seatNumber)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex flex-col items-center justify-center rounded-lg border-2 text-white font-bold text-xs sm:text-sm lg:text-base p-4 sm:p-2 
          `}
                            style={{
                              backgroundColor:seat.isBooked?'black': mySelectedSeats.includes(seat.seatNumber) ? 'rgb(59 130 246)' : isSeatDisabled(seat.seatNumber) ? 'transparent' : ' rgb(34 197 94)',
                              color: (seat.isBooked||mySelectedSeats.includes(seat.seatNumber)) ? 'white' : 'black',
                              cursor: (seat.isBooked||isSeatDisabled(seat.seatNumber)) ? 'not-allowed' : 'pointer',

                            }}
                          >
                            {/* {console.log(seat.seatNumber,seat.isBooked)} */}

                            Seat {seat.seatNumber}
                          </button>) 
                        ))}
                      </div>

                      {/* Aisle */}
                      <div className="w-5 sm:w-10"></div>

                      {/* Right Seats */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        {/* {console.log(s)} */}
                        {s?.slice(14, 28)?.map((seat) => (
                          
                          (<button
                            key={seat._id}
                            onClick={() => handleSeatSelect(seat.seatNumber)}
                            disabled={seat.isBooked||isSeatDisabled(seat.seatNumber)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex flex-col items-center justify-center rounded-lg border-2 text-white font-bold text-xs sm:text-sm lg:text-base p-4 sm:p-2 
          `}
                            style={{
                              backgroundColor:seat.isBooked?'black': mySelectedSeats.includes(seat.seatNumber) ? 'rgb(59 130 246)' : isSeatDisabled(seat.seatNumber) ? 'transparent' : ' rgb(34 197 94)',
                              color: (seat.isBooked||mySelectedSeats.includes(seat.seatNumber)) ? 'white' : 'black',
                              cursor: (seat.isBooked||isSeatDisabled(seat.seatNumber)) ? 'not-allowed' : 'pointer',
                            }}
                          >
                            Seat {seat.seatNumber}
                          </button>) 
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Last Row Seats */}
                  <div className="mt-4 flex justify-center">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        {/* {console.log(s)} */}
                        {s?.slice(28)?.map((seat) => (
                          
                          (<button
                            key={seat._id}
                            onClick={() => handleSeatSelect(seat.seatNumber)}
                            disabled={seat.isBooked||isSeatDisabled(seat.seatNumber)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex flex-col items-center justify-center rounded-lg border-2 text-white font-bold text-xs sm:text-sm lg:text-base p-4 sm:p-2 
          `}
                            style={{
                              backgroundColor:seat.isBooked?'black': mySelectedSeats.includes(seat.seatNumber) ? 'rgb(59 130 246)' : isSeatDisabled(seat.seatNumber) ? 'transparent' : ' rgb(34 197 94)',
                              color: (seat.isBooked||mySelectedSeats.includes(seat.seatNumber)) ? 'white' : 'black',
                              cursor: (seat.isBooked||isSeatDisabled(seat.seatNumber)) ? 'not-allowed' : 'pointer',
                            }}
                          >
                            Seat {seat.seatNumber}
                          </button>) 
                        ))}
                      </div>
                  </div>
                </div>

                {/* Book Seats Button for Small Screens */}
                <div className="text-center mt-8 md:hidden">
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg text-lg hover:bg-blue-700 disabled:bg-gray-300"
                    disabled={!(mySelectedSeats.length > 0 && fare > 0)|| paymentLoading}
                    onClick={handlebook}
                  >
                    <p>Fare: {`₹${fare}`}</p>

                    Book Selected Seats
                  </button>
                </div>
              </div>

              {/* Bus Info (Currently Hidden) */}
              <div className="md:w-1/2 w-full md:pl-10 ">
                <h1 className="text-4xl font-bold mb-4 text-center text-blue-600">{busData.name}</h1>
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
                <div className="text-center mt-8 hidden md:flex justify-center  ">
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg text-lg hover:bg-blue-700 disabled:bg-gray-300"
                    disabled={!(mySelectedSeats.length > 0 && fare > 0)|| paymentLoading}
                    onClick={handlebook}
                  >
                    <p>Fare: {`₹${fare}` }</p>

                    Book Selected Seats
                  </button>
                </div>
              </div>

            </div>

            {/* Book Seats Button for Large Screens */}

          </div>


      }
      <Toaster/></>

  )
}

export default BusInfo