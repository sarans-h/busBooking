import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const QReader = () => {
  const [scanResult, setScanResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScanResult(data.text); // Use `.text` if the QR data comes as an object
    }
  };

  const handleError = (err) => {
    console.error(err);
    toast.error("QR Scanner error occurred. Please try again.");
  };

  const handleMarkAsCompleted = async () => {
    if (!scanResult) {
      toast.error("No scanned data available!");
      return;
    }

    try {
      const url =
        "https://busbooking-4ykq.onrender.com/api/v1/book/completed/" +
        scanResult.substring(1, scanResult.length - 1);
      console.log(url);
      const response = await axios.put(url, { withCredentials: true });
      toast.success(response.data.message || "Booking marked as completed!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to mark booking as completed.");
    }
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  // Determine device type and camera preferences
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const videoConstraints = isMobile
    ? { facingMode: { exact: "environment" } } // Back camera on mobile
    : { facingMode: "user" }; // Default camera on desktop

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Scan QR Code</h1>
      <div className="w-80 h-80 bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-300">
        <QrScanner
          delay={300}
          style={previewStyle}
          constraints={{ video: videoConstraints }}
          onError={handleError}
          onScan={handleScan}
        />
      </div>
      <div className="mt-6 w-full max-w-md px-4 py-2 bg-white shadow rounded-lg text-center">
        <h2 className="text-lg font-semibold text-gray-700">Scanned Data:</h2>
        {scanResult ? (
          <div className="flex flex-col items-center">
            <p className="mt-2 mb-4 text-sm text-gray-800 break-all">{scanResult}</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleMarkAsCompleted}
            >
              Mark as Completed
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">No data scanned yet.</p>
        )}
      </div>
    </div>
  );
};

export default QReader;
