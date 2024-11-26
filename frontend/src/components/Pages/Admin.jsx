import React, { useState } from 'react';
import ManageBuses from './ManageBuses';
import ManageUsers from './ManageUsers';
import Revenue from './Revenue';

const Admin = () => {
  const [selectedSection, setSelectedSection] = useState('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle for mobile sidebar

  const renderSection = () => {
    switch (selectedSection) {
      case 'Manage Buses':
        return <ManageBuses />;
      case 'Manage Users':
        return <ManageUsers />;
      case 'Home':
        return <Revenue />;
      default:
        return <Revenue />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`mt-16 fixed z-10 inset-y-0 left-0 bg-gray-400 text-black w-64 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform md:relative md:translate-x-0`}
      >
        <h1 className="text-2xl font-bold p-4 border-b border-gray-100">Admin Dashboard</h1>
        <nav className="flex-1">
          {['Home','Manage Buses', 'Manage Users' ].map((section) => (
            <button
              key={section}
              onClick={() => {
                setSelectedSection(section);
                setIsSidebarOpen(false); // Close sidebar on mobile when section is selected
              }}
              className={`block w-full text-left px-6 py-3 ${
                selectedSection === section ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
       
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-20 right-4 z-20 bg-gray-600 text-white p-2 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-16 md:mt-16 overflow-y-auto">{renderSection()}</div>
    </div>
  );
};

export default Admin;
