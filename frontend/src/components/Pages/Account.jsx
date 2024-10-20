import React from 'react';

// User Data
const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image for the profile
    pastJourneys: [
      
        {
            id: 1,
            busName: 'Bus 101',
            route: 'Downtown - Uptown',
            date: '2024-09-10',
            seatsBooked: 2,
            fare: '$25',
          },{
            id: 8,
            busName: 'Bus 101',
            route: 'Downtown - Uptown',
            date: '2024-09-10',
            seatsBooked: 2,
            fare: '$25',
          },
      {
        id: 2,
        busName: 'Bus 102',
        route: 'East Side - West Side',
        date: '2024-08-20',
        seatsBooked: 1,
        fare: '$15',
      },
    ],
    upcomingJourneys: [
      {
        id: 7,
        busName: 'Bus 103',
        route: 'North Station - South Station',
        date: '2024-10-05',
        seatsBooked: 1,
        fare: '$20',
      },
      {
          id: 1,
          busName: 'Bus 103',
          route: 'North Station - South Station',
          date: '2024-10-05',
          seatsBooked: 1,
          fare: '$20',
        },    {
          id: 6,
          busName: 'Bus 103',
          route: 'North Station - South Station',
          date: '2024-10-05',
          seatsBooked: 1,
          fare: '$20',
        },    {
          id: 5,
          busName: 'Bus 103',
          route: 'North Station - South Station',
          date: '2024-10-05',
          seatsBooked: 1,
          fare: '$20',
        },    {
          id: 4,
          busName: 'Bus 103',
          route: 'North Station - South Station',
          date: '2024-10-05',
          seatsBooked: 1,
          fare: '$20',
        },    {
          id: 3,
          busName: 'Bus 103',
          route: 'North Station - South Station',
          date: '2024-10-05',
          seatsBooked: 1,
          fare: '$20',
        },    {
          id: 2,
          busName: 'Bus 103',
          route: 'North Station - South Station',
          date: '2024-10-05',
          seatsBooked: 1,
          fare: '$20',
        },
    ],
  };
// Helper function to calculate total expenditure
const calculateTotalExpenditure = (journeys) => {
  return journeys.reduce((total, journey) => {
    const fare = parseFloat(journey.fare.replace('$', '')); // Remove '$' and convert to number
    return total + fare;
  }, 0);
};

const Account = () => {
  const totalExpenditure = calculateTotalExpenditure(user.pastJourneys);

  return (
    <div className="min-h-screen bg-gray-50 pt-[2rem] px-6 sm:px-12 lg:px-24 mt-14">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-6xl w-full mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white text-center">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-3xl font-semibold mb-1">{user.name}</h2>
          <p className="text-sm">{user.email}</p>
          <p className="text-sm">{user.phone}</p>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          {/* Upcoming Journeys Section */}
          <h3 className="text-2xl font-semibold mb-4">Upcoming Journeys</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 overflow-y-scroll h-52 pb-6 no-scrollbar ">
            {user.upcomingJourneys.map((journey) => (
              <div
                key={journey.id}
                className="bg-green-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border-1 border-[#4444441c]/20"
              >
                <h4 className="text-lg font-semibold">{journey.busName}</h4>
                <p className="text-sm text-gray-600">Route: {journey.route}</p>
                <p className="text-sm text-gray-600">Date: {journey.date}</p>
                <p className="text-sm text-gray-600">Seats: {journey.seatsBooked}</p>
                <p className="text-sm text-gray-600">Fare: {journey.fare}</p>
              </div>
            ))}
          </div>

          {/* Past Journeys Section */}
          <h3 className="text-2xl font-semibold mb-4">Past Journeys</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 overflow-y-scroll h-52 pb-6 no-scrollbar">
            {user.pastJourneys.map((journey) => (
              <div
                key={journey.id}
                className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="text-lg font-semibold">{journey.busName}</h4>
                <p className="text-sm text-gray-600">Route: {journey.route}</p>
                <p className="text-sm text-gray-600">Date: {journey.date}</p>
                <p className="text-sm text-gray-600">Seats: {journey.seatsBooked}</p>
                <p className="text-sm text-gray-600">Fare: {journey.fare}</p>
              </div>
            ))}
          </div>

          {/* Total Expenditure Section */}
          <div className="my-6 bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold">Total Expenditure</h3>
            <p className="text-lg text-gray-800 mt-2">
              You have spent a total of{' '}
              <span className="font-bold text-blue-600">${totalExpenditure}</span> on your journeys.
            </p>
          </div>

          {/* Account Settings Section */}
          <h3 className="text-2xl font-semibold mb-4">Account Settings</h3>
          <div className="bg-gray-100 rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-700">Email: {user.email}</p>
            <p className="text-sm text-gray-700">Phone: {user.phone}</p>
            {/* Add additional account settings options here */}
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
