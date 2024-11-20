import React from "react";
import { FaShieldAlt, FaLeaf, FaCouch } from "react-icons/fa"; // React Icons library
import { Card } from "@nextui-org/react"; // Install with `npm install @nextui-org/react`

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-r to-yellow-200 from-yellow-100 text-black min-h-screen p-8 pt-24">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Rideverse</h1>
        <p className="text-lg mb-6">
          At Rideverse, we redefine travel. Our mission is to provide seamless,
          eco-friendly, and comfortable bus journeys that connect cities and
          communities.
        </p>
        <div className="flex justify-center mb-12 gap-8">
          <Card className="bg-white text-black p-4 w-72">
            <h2 className="font-semibold text-xl mb-2">Our Vision</h2>
            <p>
              To become the most trusted and sustainable bus travel company,
              setting new standards in innovation and excellence.
            </p>
          </Card>
          <Card className="bg-white text-black p-4 w-72">
            <h2 className="font-semibold text-xl mb-2">Our Mission</h2>
            <p>
              Deliver reliable, cost-effective, and environmentally conscious
              travel experiences to every passenger.
            </p>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Why Ride with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center bg-gray-100 text-black p-4 rounded-lg">
              <FaShieldAlt className="text-yellow-500 text-5xl mb-3" />
              <h3 className="font-bold mb-2">Safety First</h3>
              <p>Our top priority is ensuring every journey is safe and secure.</p>
            </div>
            <div className="flex flex-col items-center bg-gray-100 text-black p-4 rounded-lg">
              <FaLeaf className="text-green-500 text-5xl mb-3" />
              <h3 className="font-bold mb-2">Eco-Friendly</h3>
              <p>
                We are committed to reducing our carbon footprint with
                sustainable travel solutions.
              </p>
            </div>
            <div className="flex flex-col items-center bg-gray-100 text-black p-4 rounded-lg">
              <FaCouch className=" text-5xl mb-3 text-yellow-500" />
              <h3 className="font-bold mb-2">Unmatched Comfort</h3>
              <p>
                Experience luxury seating, modern amenities, and smooth rides
                with Rideverse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
