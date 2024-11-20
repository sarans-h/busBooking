import React, { useState, useEffect } from 'react';
import { Input, Button, Textarea, Tooltip, Divider, Checkbox } from '@nextui-org/react'; // Import Checkbox from nextui
import { useDispatch, useSelector } from 'react-redux';
import { createBus, clearErrors, newBusReset } from '../../slices/busSlice'; // Import your Redux actions
import { useNavigate } from 'react-router-dom'; // If you want to redirect after success
import toast, { Toaster } from 'react-hot-toast';

const AddBus = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.bus); // Access Redux state

  const [busData, setBusData] = useState({
    name: '',
    driver: { name: '', contact: '' },
    busNumber: '',
    type: '',
    features: [],
    description: '',
    numberOfSeats: 30,
    isAvailable: true,
    travel: '',
    journeyDate: '',
    stoppages: [{ location: '', time: '', fare: '' }],
  });

  const [isLoading, setIsLoading] = useState(false);

  // Available features options
  const featuresOptions = ["WiFi", "Reclining Seats", "Charging Ports"];

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedBusData = localStorage.getItem('busData');
    if (savedBusData) setBusData(JSON.parse(savedBusData));
  }, []);

  useEffect(() => {
    localStorage.setItem('busData', JSON.stringify(busData));
  }, [busData]);

  useEffect(() => {
    if (success) {
      toast.success("Bus added successfully");
      setBusData({
        name: '',
        driver: { name: '', contact: '' },
        busNumber: '',
        type: '',
        features: [],
        description: '',
        numberOfSeats: 30,
        isAvailable: true,
        travel: '',
        journeyDate: '',
        stoppages: [{ location: '', time: '', fare: '' }],
      });
      dispatch(newBusReset());
      localStorage.removeItem('busData');
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDriverChange = (e) => {
    const { name, value } = e.target;
    setBusData((prev) => ({
      ...prev,
      driver: { ...prev.driver, [name]: value },
    }));
  };

  const handleStoppageChange = (index, field, value) => {
    const updatedStoppages = busData.stoppages.map((stoppage, i) =>
      i === index ? { ...stoppage, [field]: value } : stoppage
    );
    setBusData((prev) => ({ ...prev, stoppages: updatedStoppages }));
  };

  const addStoppage = () => {
    setBusData((prev) => ({
      ...prev,
      stoppages: [...prev.stoppages, { location: '', time: '', fare: '' }],
    }));
  };

  const removeStoppage = (index) => {
    const updatedStoppages = busData.stoppages.filter((_, i) => i !== index);
    setBusData((prev) => ({ ...prev, stoppages: updatedStoppages }));
  };

  // Handle feature selection
  const handleFeatureChange = (feature) => {
    setBusData((prev) => {
      const updatedFeatures = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busData.stoppages.length < 2) {
      toast.error('Please add at least 2 stoppages.');
      return; // Prevent form submission if validation fails
    }
    setIsLoading(true);
    // Create FormData and append fields
    const formData = new FormData();
    formData.append('name', busData.name);
    formData.append('busNumber', busData.busNumber);
    formData.append('type', busData.type);
    formData.append('numberOfSeats', busData.numberOfSeats);
    formData.append('description', busData.description);
    formData.append('isAvailable', busData.isAvailable);
    formData.append('journeyDate', busData.journeyDate);

    // Append driver details (flattened)
    formData.append('driverName', busData.driver.name);
    formData.append('driverContact', busData.driver.contact);

    // Append stoppages
    busData.stoppages.forEach((stoppage, index) => {
      formData.append(`stoppages[${index}][location]`, stoppage.location);
      formData.append(`stoppages[${index}][time]`, stoppage.time);
      formData.append(`stoppages[${index}][fare]`, stoppage.fare);
    });

    // Append features
    busData.features.forEach((feature, index) => {
      formData.append(`features[${index}]`, feature);
    });

    // Dispatch the createBus action with FormData
    dispatch(createBus(formData));
    setIsLoading(false); // Optionally, handle loading state in the UI
  };


  return (
    <div className="flex justify-center items-start min-h-screen  pt-[12vh] px-4 sm:px-6 bg-yellow-100 lg:px-8">
      <div className="w-full max-w-7xl bg-yellow-50 border-black border-1 shadow-md rounded-xl p-6 m-4">
        <h3 className="text-center text-2xl font-bold mb-6">Add a New Bus</h3>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Left Section: Bus Details, Driver Details, Travel and Schedule */}
            <div className="w-full lg:w-1/2 space-y-6">
              <Divider />
              <h4 className="text-lg my-4">Bus Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  clearable
                  bordered
                  placeholder="Bus Name"
                  name="name"
                  fullWidth
                  value={busData.name}
                  onChange={handleChange}
                  required
                />
                <Tooltip content="Enter the bus number in this format: DL01AB1234">
                  <Input
                    clearable
                    bordered
                    placeholder="Bus Number"
                    name="busNumber"
                    fullWidth
                    value={busData.busNumber}
                    onChange={handleChange}
                    required
                  />
                </Tooltip>
                <select
                  name="type"
                  value={busData.type}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  required
                >
                  <option value="">Select Bus Type</option>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
                <Input
                  bordered
                  placeholder="Number of Seats (Max 32)"
                  type="number"
                  name="numberOfSeats"
                  fullWidth
                  value={busData.numberOfSeats}
                  onChange={handleChange}
                  max={32}
                  required
                />
              </div>
              <Textarea
                bordered
                placeholder="Description (Max 2000 characters)"
                name="description"
                fullWidth
                value={busData.description}
                onChange={handleChange}
                className="my-4"
                maxLength={2000}
                required
              />
              <Divider />
              <h4 className="text-lg my-4">Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {featuresOptions.map((feature) => (
                  <Checkbox
                    key={feature}
                    isSelected={busData.features.includes(feature)}
                    onChange={() => handleFeatureChange(feature)}
                  >
                    {feature}
                  </Checkbox>
                ))}
              </div>
              <Divider />
              <h4 className="text-lg my-4">Driver Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  clearable
                  bordered
                  placeholder="Driver's Name"
                  name="name"
                  fullWidth
                  value={busData.driver.name}
                  onChange={handleDriverChange}
                  required
                />
                <Input
                  clearable
                  bordered
                  placeholder="Driver's Contact (10-digit number)"
                  name="contact"
                  fullWidth
                  value={busData.driver.contact}
                  onChange={handleDriverChange}
                  status={busData.driver.contact && !/^\d{10}$/.test(busData.driver.contact) ? "error" : "default"}
                  helperText={busData.driver.contact && !/^\d{10}$/.test(busData.driver.contact) ? "Invalid contact number" : ""}
                  required
                />
              </div>
              <Divider />
              <h4 className="text-lg my-4">Travel and Schedule</h4>
              <label htmlFor="journeyDate" className="">Journey Date And Start Time</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input
                  bordered
                  placeholder="Journey Date"
                  type="datetime-local"
                  name="journeyDate"
                  fullWidth
                  value={busData.journeyDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Right Section: Stoppages */}
            <div className="w-full lg:w-1/2 space-y-6 mt-6 lg:mt-0">
  <Divider />
  <h4 className="text-lg my-4">Stoppages</h4>
  
  {/* Scrollable Stoppages Container */}
  <div className="overflow-y-auto" style={{ maxHeight: '604px' }}>
    {busData.stoppages.map((stoppage, index) => (
      <div key={index} className="border border-black p-4 rounded-md mb-4">
        <h5 className="font-semibold mb-2">Stoppage {index + 1}</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            clearable
            bordered
            placeholder={`Stoppage Location ${index + 1}`}
            value={stoppage.location}
            onChange={(e) => handleStoppageChange(index, 'location', e.target.value)}
            fullWidth
            required
          />
          <Input
            bordered
            placeholder="Stoppage Time"
            type="datetime-local"
            value={stoppage.time}
            onChange={(e) => handleStoppageChange(index, 'time', e.target.value)}
            fullWidth
            required
          />
          <Input
            bordered
            placeholder="Fare (in INR)"
            type="number"
            value={stoppage.fare}
            onChange={(e) => handleStoppageChange(index, 'fare', e.target.value)}
            fullWidth
            required
          />
        </div>
        <div className="mt-2 text-right">
          <Button
            type="button"
            onClick={() => removeStoppage(index)}
            color="danger"
            size="sm"
            auto
          >
            Remove
          </Button>
        </div>
      </div>
    ))}
  </div>

  <Button type="button" onClick={addStoppage} className="w-full">
    Add Another Stoppage
  </Button>
</div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <Button type="submit" disabled={loading} shadow   auto className="w-64 bg-yellow-400">
              {loading ? 'Submitting...' : 'Submit Bus Details'}
            </Button>
          </div>
        </form>
      </div>
      <Toaster/>
    </div>
  );
};

export default AddBus;
