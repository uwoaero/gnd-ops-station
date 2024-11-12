'use client'

import { useEffect, useState } from 'react';
import Button from './components/Button';
import Dropdown from './components/Dropdown';
import GroundStationStatus from "./components/GroundStationStatus";


export default function Home() {
  const [recordingStatus, setRecordingStatus] = useState(false);

  const [telemetry, setTelemetry] = useState({
    ground_speed: "-",
    air_speed: "-",
    battery_voltage: "-",
    lon: "-",
    lat: "-",
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
        lon: `${data.longitude || "-"}`,
        lat: `${data.latitude || "-"}`,
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

  const changeRecording = () => {
    if (recordingStatus) {
      setRecordingStatus(false)
    } else {
      setRecordingStatus(true)
    }
  }

  return (
    <div className={`h-screen w-screen overflow-hidden bg-black-200 text-white flex flex-col items-center bg-green-50	`}>
      <div className="flex items-center">
        <h1 className="font-bold text-6xl text-center p-8 text-black">Ground Station</h1>
        <img src="/logo.png" alt="Logo" className="h-20 mb-0" />
      </div>
      <div className='flex w-full h-full'>
        <div className='w-5/12'>
          <div className="text-gray-800 font-normal  rounded-lg flex-1 space-y-4 h-2/3 px-8">
              <div className="text-4xl h-full border-0 border-b-2  ">
              <p className='py-4'><strong>Ground Speed: {telemetry.ground_speed}</strong> </p>
              <p className='py-4'><strong>Air Speed: {telemetry.air_speed}</strong> </p>
              <p className='py-4'> <strong>Longitude: {telemetry.lon}</strong> </p>
              <p className='py-4'><strong>Latitude: {telemetry.lat}</strong> </p>
              <p className='py-4'><strong>Altitude: {telemetry.altitude}</strong></p>
              <p className='py-4'><strong>Battery Voltage: {telemetry.battery_voltage}</strong></p>

            </div>
          </div>
          <div className="rounded-lg shadow-md w-full h-1/3">
            <div className='flex items-center justify-center'>
              <h1 className="text-black font-normal">Select Data Source: </h1>
              <Dropdown className="h-20 px-4"></Dropdown>
            </div>
            <div className='flex items-center justify-center pb-2'>
              <GroundStationStatus recording={recordingStatus}></GroundStationStatus>

            </div>
            <div className='flex items-center justify-center py-4 text-xl'>
              <button className={`${recordingStatus ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"} mx-4 p-6 py-4 rounded-lg font-semibold focus:outline-none text-white`} onClick={changeRecording}>{recordingStatus ? "Stop Recording" : "Start Recording"}</button>
              <button className="p-6 py-4 mx-4 rounded-lg bg-sky-950 font-semibold text-white hover:bg-sky-800" onClick={() => alert('Going to Database')}>View Database</button>
              <button className="p-6 py-4 mx-4 rounded-lg bg-sky-950 font-semibold text-white hover:bg-sky-800" onClick={() => alert('Starting Recording')}>Manage Database</button>
            </div>
          </div>
        </div>
        <div className='w-7/12 h-full'>
          <div className="bg-gray-800 rounded-lg shadow-md w-full h-1/2 flex items-center justify-center">
            <p className="text-gray-400">FPV View</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md w-full h-1/2 flex items-center justify-center">
            <p className="text-gray-400">Yaw/Pitch/Roll Visualizer</p>
          </div>
        </div>
      </div>

    </div>
  );
}
