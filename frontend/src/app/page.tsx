'use client'

// import Button from './components/Button';
import Dropdown from './components/Dropdown';
import GroundStationStatus from "./components/GroundStationStatus";
import { useEffect, useState } from 'react';



export default function Home() {

  const [telemetry, setTelemetry] = useState({
    ground_speed: "-",
    air_speed: "-",
    battery_voltage: "-",
    lon_lat: "-",
    altitude: "-",
  });

  useEffect(() => {
    //const backendUrl = process.env.NEXT_PUBLIC_WS_URL || '';
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received telemetry data:", event.data);

      // Update telemetry state
      setTelemetry({
        ground_speed: data.ground_speed || "-",
        air_speed: data.air_speed || "-",
        battery_voltage: data.battery_voltage || "-",
        lon_lat: `${data.longitude || "-"}, ${data.latitude || "-"}`,
        altitude: data.altitude || "-",
      });

    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close(); // Cleanup WebSocket connection on unmount
    };
  }, []);


  return (
    <div className={`w-full min-h-screen bg-black-200 text-white flex flex-col items-center`}>
      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="h-20 mb-0" /> 
        <h1 className="text-xl text-center">Ground Station Interface</h1>
      </div>

      <div className="bg-gray-700 text-white rounded-lg shadow-md w-full p-6 mx-8 mt-1"> 
        <h2 className="text-lg font-bold text-center">Recording and Database</h2>
        <p className="text-gray-300 text-center mt-2">Use the buttons below to control the system.</p>
        <div className="flex gap-4 mt-6 justify-center">
          <GroundStationStatus></GroundStationStatus>
          <button className="px-4 py-2 h-10 rounded focus:outline-none focus:ring focus:ring-opacity-50 bg-blue-500 text-white hover:bg-blue-600" onClick={() => alert('Going to Database')}>Go to Database</button>
          <button className="px-4 py-2 h-10 rounded focus:outline-none focus:ring focus:ring-opacity-50 bg-green-500 text-white hover:bg-green-600" onClick={() => alert('Starting Recording')}>Start Recording</button>
          <button className="px-4 py-2 h-10 rounded focus:outline-none focus:ring focus:ring-opacity-50 bg-red-500 text-white hover:bg-red-600" onClick={() => alert('Stopping Recording')}>Stop Recording</button>
          <Dropdown className="mt-[-10px]"></Dropdown>
        </div>
      </div>

      <div className="flex flex-grow w-full px-8 gap-8 mt-2">
        <div className="bg-white text-black rounded-lg shadow-md p-8 flex-1 space-y-4 min-h-[250px]">
          <h2 className="text-lg font-bold text-center">Metrics</h2>
          <div className="space-y-2">
          <p><strong>Ground Speed:</strong> {telemetry.ground_speed}</p>
          <p><strong>Air Speed:</strong> {telemetry.air_speed}</p>
          <p><strong>Battery Voltage:</strong> {telemetry.battery_voltage}</p>
          <p><strong>Longitude/Latitude:</strong> {telemetry.lon_lat}</p>
          <p><strong>Altitude:</strong> {telemetry.altitude}</p>
          </div>
        </div>

        <div className="flex flex-col flex-1 space-y-4 min-h-[250px]">
          <div className="bg-gray-800 rounded-lg shadow-md w-full h-1/2 flex items-center justify-center">
            <p className="text-gray-400">FPV View</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md w-full h-1/2 flex items-center justify-center">
            <img src="/model-plane.jpg" alt="Model Plane" className="object-contain w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
