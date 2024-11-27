import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, useDisclosure } from "@nextui-org/react"; // Import the necessary components

const ManageBuses = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();  // Using useDisclosure to control the modal state
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBuses, setTotalBuses] = useState(0);
  const [editMode, setEditMode] = useState(false);  // Check if we are editing a bus
  const [selectedBus, setSelectedBus] = useState(null);  // State for selected bus
  const [busName, setBusName] = useState("");  // State for bus name
  const [stoppages, setStoppages] = useState([]);  // State for bus stoppages
  const resultPerPage = 4;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (busId, busName) => {
    try {
      await axios.delete(`https://busbooking-4ykq.onrender.com/api/v1/bus/delete/${busId}`,{ withCredentials: true });
      toast.success(`${busName} deleted successfully!`);
      setBuses(buses.filter((bus) => bus._id !== busId));
      onOpenChange(false);  // Close modal after deletion
    } catch (err) {
      toast.error("Failed to delete bus.");
    }
  };

  const openEditModal = (bus) => {
    setSelectedBus(bus);  // Set the selected bus to edit
    setBusName(bus.name);
    // setStoppages(bus.stoppages);
    setEditMode(true);  // Set edit mode to true
    onOpen();  // Open the modal
  };

  const openDeleteModal = (bus) => {
    setSelectedBus(bus);  // Set the selected bus for deletion
    onOpen();  // Open delete modal
  };

  const closeModal = () => {
    onOpenChange(false);  // Close the modal
    setSelectedBus(null);  // Reset selected bus
    setBusName("");  // Clear bus name
    setStoppages([]);  // Clear stoppages
    setEditMode(false);  // Reset edit mode
  };

  const handleSaveChanges = async () => {
    if (!busName) {
      toast.error("Please provide valid bus details.");
      return;
    }
    try {
      // console.log(selectedBus._id);
      await axios.put(`https://busbooking-4ykq.onrender.com/api/v1/bus/update/${selectedBus._id}`, {
        name: busName
      },{ withCredentials: true });
      toast.success("Bus updated successfully!");
      setBuses(buses.map(bus => bus._id === selectedBus._id ? { ...bus, name: busName, stoppages } : bus));  // Update the bus in state
      onOpenChange(false);  // Close the modal
    } catch (err) {
      toast.error("Failed to update bus.");
    }
  };

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get(`https://busbooking-4ykq.onrender.com/api/v1/bus/buses?page=${currentPage}`,{ withCredentials: true });
        setBuses(response.data.buses);
        setTotalBuses(response.data.totalBuses);
      } catch (err) {
        setError(err.message || "Failed to fetch buses.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [currentPage]);

  const totalPages = Math.ceil(totalBuses / resultPerPage);

  if (loading) {
    return <div className="p-6">Loading buses...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Buses</h2>
        <p className="text-gray-600 mb-6">
          Here you can add, edit, and delete buses. Manage your fleet with ease.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Route</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Seats</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{bus.stoppages[0].location} to {bus.stoppages[bus.stoppages.length-1].location}</td>
                  <td className="border border-gray-300 px-4 py-2">{bus.availableSeats}/{bus.numberOfSeats}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        new Date(bus.journeyDate) < new Date()
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {new Date(bus.journeyDate) < new Date() ? "Expired" : "Active"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2">
                      {/* <button
                        className="text-blue-600 hover:underline"
                        onClick={() => openEditModal(bus)}
                      >
                        Edit
                      </button> */}
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => openDeleteModal(bus)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white bg-blue-600 rounded-l"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-gray-700">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-white bg-blue-600 rounded-r"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{editMode ? "Edit Bus" : "Confirm Deletion"}</ModalHeader>
          <ModalBody>
            {editMode ? (
              <div>
                <Input
                  fullWidth
                  label="Bus Name"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                />
                {/* <Textarea
                  fullWidth
                  label="Stoppages (comma-separated)"
                  value={stoppages.join(", ")}
                  onChange={(e) => setStoppages(e.target.value.split(",").map(item => item.trim()))}
                /> */}
              </div>
            ) : (
              <p>Are you sure you want to delete the bus {selectedBus?.name}?</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>Cancel</Button>
            <Button color="primary" onPress={editMode ? handleSaveChanges : () => handleDelete(selectedBus._id, selectedBus.name)}>
              {editMode ? "Save Changes" : "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Toaster />
    </div>
  );
};

export default ManageBuses;
