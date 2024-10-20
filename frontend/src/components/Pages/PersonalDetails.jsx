import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';

const PersonalDetails = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Cityville, USA',
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image for profile picture
  });

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  const handleUpdateDetails = (e) => {
    e.preventDefault();
    console.log('Updated Personal Info:', personalInfo);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (password.newPassword === password.confirmNewPassword) {
      console.log('Password successfully changed');
    } else {
      console.error('New password and confirmation do not match');
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPersonalInfo({ ...personalInfo, profilePicture: imageUrl });
    }
  };

  const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false); // Track toggle state

  const toggleProfilePictureInput = () => {
    setIsEditingProfilePicture(!isEditingProfilePicture);
  };

  return (
    <div className="p-8 bg-white shadow-sm rounded-lg max-w-3xl mx-auto my-20 border-black border-1">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit  Personal Details</h2>

      {/* Profile Picture and Edit Button Wrapper */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={personalInfo.profilePicture}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 shadow-lg"
        />

        {/* Edit Button */}
        <button
          onClick={toggleProfilePictureInput}
          className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-2xl mb-4"
        >
          <FiEdit /> {/* Show only the edit icon */}
        </button>

        {/* Profile Picture Update Input */}
        {isEditingProfilePicture && (
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="text-sm text-gray-600"
          />
        )}
      </div>

      {/* Personal Information Form */}
      <form onSubmit={handleUpdateDetails}>
        {/* Two Inputs on One Line */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-lg font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={personalInfo.name}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>
        </div>

        {/* Another Two Inputs on One Line */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-lg font-medium text-gray-600">Phone</label>
            <input
              type="tel"
              name="phone"
              value={personalInfo.phone}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-600">Address</label>
            <input
              type="text"
              name="address"
              value={personalInfo.address}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg"
        >
          Update Details
        </button>
      </form>

      {/* Change Password Form */}
      <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-6">Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-600">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={password.currentPassword}
            onChange={handlePasswordChange}
            className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-600">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={password.newPassword}
            onChange={handlePasswordChange}
            className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-600">Confirm New Password</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={password.confirmNewPassword}
            onChange={handlePasswordChange}
            className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-400 to-red-500 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default PersonalDetails;
