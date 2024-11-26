import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://busbooking-4ykq.onrender.com/api/v1/admin/allusers");
      setUsers(data.users);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://busbooking-4ykq.onrender.com/api/v1/admin/user/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id)); // Update local state
      toast.success("User deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h2>
        <p className="text-gray-600 mb-6">Here you can view and manage users of the platform.</p>

        {/* Action Buttons
        <div className="flex justify-end mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
            Add User
          </button>
        </div> */}

        {/* Error Message */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Loading Spinner */}
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : (
          // Users Table
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Role</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      

      <Toaster />
    </div>
  );
};

export default ManageUsers;
