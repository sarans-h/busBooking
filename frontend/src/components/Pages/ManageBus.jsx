import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageBus = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [revenue, setRevenue] = useState(0);
  const [size, setSize] = useState("md"); // Modal size
  const [search, setSearch] = useState(""); // Search input
  const [buses, setBuses] = useState([]); // Original buses
  const [filteredBuses, setFilteredBuses] = useState([]); // Filtered buses
  const [selectedBus, setSelectedBus] = useState(null); // Selected bus for modal
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch buses from the API
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get("https://busbooking-4ykq.onrender.com/api/v1/book/revenue",{ withCredentials: true });
        console.log(response.data)
        setRevenue(response.data.totalRevenue || 0); // Assuming API returns `{ revenue: number }`
      } catch (err) {
        console.error("Failed to fetch revenue:", err.message);
      }
    };
  
    fetchRevenue();
  }, []);
  
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://busbooking-4ykq.onrender.com/api/v1/bus/mybuses",{ withCredentials: true });
        const busesData = response.data.data.map((bus) => ({
          id: bus._id,
          name: bus.name,
          number: bus.busNumber,
          capacity: bus.numberOfSeats,
          type: bus.type,
          availableSeats: bus.availableSeats,
        }));
        setBuses(busesData);
        setFilteredBuses(busesData);
      } catch (err) {
        setError(err.message || "Failed to fetch buses.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Search handler
  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = buses.filter(
      (bus) =>
        bus.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        bus.number.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBuses(filtered);
  };

  // Open modal for a specific bus
  const openModal = (bus, modalSize = "md") => {
    setSelectedBus(bus);
    setSize(modalSize);
    onOpen();
  };

  // Close modal
  const closeModal = () => {
    setSelectedBus(null);
    onClose();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 mt-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Manage Buses</h1>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-4">
  {/* Search Section */}
  <Card className="p-6  bg-white shadow-md rounded-lg w-3/4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Search Buses</h2>
      <Button color="primary" onPress={() => navigate("/addbus")}>
        Add Bus
      </Button>
    </div>
    <Input
      clearable
      label="Search"
      placeholder="Search by bus name or number"
      value={search}
      onChange={handleSearch}
      className="w-full"
    />
  </Card>

  {/* Revenue Card */}
  <Card className="p-4  shadow-md rounded-lg w-3/4 sm-w-1/4 h-40 text-center">
    <h3 className="text-3xl font-semibold mb-2 text-black">Total Revenue</h3>
    <p className="text-xl font-bold text-green-400">₹{revenue}</p>
    <Button color='primary' onClick={()=>navigate('/breakup')}> View Break up</Button>
  </Card>
</div>


        {/* Bus List Table */}
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Bus List</h2>
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left text-gray-600">BUS NAME</th>
                    <th className="p-3 text-left text-gray-600">BUS NUMBER</th>
                    <th className="p-3 text-left text-gray-600">CAPACITY</th>
                    <th className="p-3 text-left text-gray-600">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuses.length > 0 ? (
                    filteredBuses.map((bus) => (
                      <tr key={bus.id} className="border-b">
                        <td className="p-3">{bus.name}</td>
                        <td className="p-3">{bus.number}</td>
                        <td className="p-3">{bus.capacity}</td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            color="primary"
                            onPress={() => openModal(bus, "md")}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 text-center" colSpan="4">
                        No buses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Modal for Viewing/Editing Bus Details */}
        {selectedBus && (
          <Modal size={size} isOpen={isOpen} onClose={closeModal}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">{`View/Edit ${selectedBus.name}`}</ModalHeader>
                  <ModalBody>
                    <Input
          disabled

clearable
                      label="Bus Name"
                      value={selectedBus.name}
                      onChange={(e) =>
                        setSelectedBus({ ...selectedBus, name: e.target.value })
                      }
                    />
                    <Input
          disabled

clearable
                      label="Bus Number"
                      value={selectedBus.number}
                      onChange={(e) =>
                        setSelectedBus({
                          ...selectedBus,
                          number: e.target.value,
                        })
                      }
                    />
                    <Input
          disabled

type="number"
                      label="Capacity"
                      value={selectedBus.capacity}
                      onChange={(e) =>
                        setSelectedBus({
                          ...selectedBus,
                          capacity: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={closeModal}>
                      Close
                    </Button>
                    {/* <Button
                      color="primary"
                      onPress={() => {
                        setBuses(
                          buses.map((bus) =>
                            bus.id === selectedBus.id ? selectedBus : bus
                          )
                        );
                        closeModal();
                      }}
                    >
                      Save Changes
                    </Button> */}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ManageBus;
