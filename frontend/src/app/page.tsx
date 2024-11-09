'use client'

import Button from './components/Button';
import Dropdown from './components/Dropdown';
import GroundStationStatus from "./components/GroundStationStatus";

export default function Home() {

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
            <p><strong>Ground Speed:</strong> <span id="ground-speed">-</span></p>
            <p><strong>Air Speed:</strong> <span id="air-speed">-</span></p>
            <p><strong>Battery Voltage:</strong> <span id="battery-voltage">-</span></p>
            <p><strong>Longitude/Latitude:</strong> <span id="lon-lat">-</span></p>
            <p><strong>Altitude:</strong> <span id="altitude">-</span></p>
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
