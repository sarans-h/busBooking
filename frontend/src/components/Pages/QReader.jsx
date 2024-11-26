import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const QReader = () => {
  const [scanResult, setScanResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      console.log(typeof(data))
      setScanResult(data);
    }
  };

  // const handleError = (err) => {
  //   console.error(err);
  // };

  const handleMarkAsCompleted = async () => {
    if (!scanResult) {
      toast.error("No scanned data available!");
      return;
    }

    try {
      const url='api/v1/book/completed/'+scanResult.substring(1,scanResult.length-1);
      console.log(url)
      const response = await axios.put(url);
      toast.success(response.data.message || "Booking marked as completed!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to mark booking as completed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Scan QR Code</h1>
      <div className="w-72 h-72 bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-300">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (result) {
              handleScan(result.text);
            }
            // if (error) {
            //   handleError(error);
            // }
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="mt-6 w-full max-w-md px-4 py-2 bg-white shadow rounded-lg text-center">
        <h2 className="text-lg font-semibold text-gray-700">Scanned Data:</h2>
        {scanResult ? (
          <div className="flex flex-col items-center">
            <p className="mt-2 mb-4 text-sm text-gray-800 break-all">{scanResult}</p>
            <Button
              color="primary"
              className="w-full max-w-xs"
              onClick={handleMarkAsCompleted}
            >
              Mark as Completed
            </Button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">No data scanned yet.</p>
        )}
      </div>
    </div>
  );
};

export default QReader;
