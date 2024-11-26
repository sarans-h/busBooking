import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getUsers, revenue } from "../../slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Revenue = () => {
  const dispatch = useDispatch();

  // Access the required state from the Redux slice
  const { totalRevenue, loading, error, allUser } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        dispatch(revenue()); // Dispatch the action; data will come via Redux state
      } catch (err) {
        console.error("Failed to fetch total revenue:", err);
      }
    };

    fetchRevenue();
  }, [dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(getUsers()); // Dispatch the action; data will come via Redux state
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const [users, setUsers] = useState([]);
  const [travelers, setTravelers] = useState([]);

  useEffect(() => {
    // Separate users into admins and travelers
    setUsers(allUser.filter((user) => user.role === "user"));
    setTravelers(allUser.filter((user) => user.role === "travel"));
  }, [allUser]);

  const [totalUsersSpend, setTotalUsersSpend] = useState(0);
  const [totalTravelersEarned, setTotalTravelersEarned] = useState(0);

  useEffect(() => {
    // Calculate total spend by users
    let totalSpend = 0;
    for (let user of users) {
      totalSpend += user.totalSpend || 0;
    }
    setTotalUsersSpend(totalSpend);

    // Calculate total earned by travelers
    let totalEarned = 0;
    for (let traveler of travelers) {
      totalEarned += traveler.totalEarned || 0;
    }
    setTotalTravelersEarned(totalEarned);
  }, [users, travelers]);

  // Chart Data for Revenue Comparison
  const revenueChartData = {
    labels: ["Users Total Spend", "Travelers Total Earned"],
    datasets: [
      {
        label: "Revenue",
        data: [totalUsersSpend, totalTravelersEarned],
        backgroundColor: ["#36a2eb", "#ff6384"],
        borderColor: ["#36a2eb", "#ff6384"],
        borderWidth: 1,
      },
    ],
  };

  // Chart Data for User vs Traveler Count
  const userTravelerCountChartData = {
    labels: ["Users", "Travelers"],
    datasets: [
      {
        label: "Number of Users",
        data: [users.length, travelers.length],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#4caf50", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart",
      },
    },
  };

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Revenue Dashboard</h2>
      <div className="mb-6">
        <p className="text-lg font-semibold">Total Revenue:</p>
        <p className="text-2xl font-bold text-green-500">
        ₹{totalRevenue ? totalRevenue.toLocaleString() : "0"}
        </p>
      </div>

      {/* Revenue Comparison Chart */}
      <div className="mb-10 flex justify-center md:flex-row flex-col"  style={{ width: "400px", margin: "0 auto" }}>
        <Bar data={revenueChartData} options={{ ...chartOptions, title: { text: "Revenue Comparison Chart" } }} />
     
        <Bar
          data={userTravelerCountChartData}
          options={{ ...chartOptions, title: { text: "User vs Traveler Count Chart" } }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-4">Users</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">₹ {user.totalSpend || 0}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 px-4 py-2 text-right" colSpan="2">
                  Total:
                </td>
                <td className="border border-gray-300 px-4 py-2">₹ {totalUsersSpend}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold mb-4">Traveler</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Total Earned</th>
              </tr>
            </thead>
            <tbody>
              {travelers.map((traveler) => (
                <tr key={traveler._id}>
                  <td className="border border-gray-300 px-4 py-2">{traveler.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{traveler.email}</td>
                  <td className="border border-gray-300 px-4 py-2">₹ {traveler.totalEarned || 0}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 px-4 py-2 text-right" colSpan="2">
                  Total:
                </td>
                <td className="border border-gray-300 px-4 py-2">₹ {totalTravelersEarned}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
