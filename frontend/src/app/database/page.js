'use client'

import React, { useEffect, useState } from 'react'
import axios from "axios";

export default function Page() {
    const [flights, setFlights] = useState();
    const [data, setData] = useState(null);
    const [flightLength, setFlightLength] = useState(0)

    const getFlights = async () => {
        try {
            const response = await axios.get('http://localhost:5000/database/flights');
            const data = await response.data;
            setFlights(data);
            loadFlightData(data.flights[0].flight_id)
            

        } catch (error) {
            console.error('Error fetching flight data:', error);
        }

        // loadFlightData(flights.flights[0].flight_id)

    }

    const loadFlightData = async (flight_id) => {
        const response = await axios.get(`http://localhost:5000/database/${flight_id}`)
        const data = await response.data.selectedFlight;
        setData(data)

        //get flight length
        let counter = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i]._field == "air_speed") {
                counter++
            } else {
                break
            }
        }
        setFlightLength(counter)
        console.log(counter)
    }


    const handleChange = async (e) => {
        console.log(e.target.value)
        loadFlightData(e.target.value)

    }

    const displayData = () => {
        return (
            <div>
                <table className='table-auto w-full'>
                    <thead className='bg-gray-50 border-b-2 border-gray-200'>
                        <tr>
                            <th className="p-3 text-2xl font-semibold text-center">Time (EST)</th>
                            <th className="p-3 text-2xl font-semibold text-center">Air Speed (m/s)</th>
                            <th className="p-3 text-2xl font-semibold text-center">Ground Speed (m/s)</th>
                            <th className="p-3 text-2xl font-semibold text-center">Altitude (m)</th>
                            <th className="p-3 text-2xl font-semibold text-center">Latitude</th>
                            <th className="p-3 text-2xl font-semibold text-center">Longitude</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRow()}
                    </tbody>
                </table>

            </div>
        )
    }

    const displayRow = () => {
        const rows = []
        for (let i = 0; i < flightLength; i++) {
            rows.push(
                <tr key={i} className="py-4 border-b-2 border-gray-100 hover:bg-gray-100">
                    <td className="p-3 text-lg text-gray-700">{JSON.stringify(data[i + flightLength*3]._value)}</td>
                    <td className="p-3 text-lg text-gray-700">{JSON.stringify(data[i]._value)}</td>
                    <td className="p-3 text-lg text-gray-700">{JSON.stringify(data[i + flightLength*4]._value)}</td>
                    <td className="p-3 text-lg text-gray-700">{JSON.stringify(data[i + flightLength*1]._value)}</td>
                    <td className="p-3 text-lg text-gray-700">{JSON.stringify(data[i + flightLength*5]._value)}</td>
                    <td className="p-3 text-lg text-gray-700">{(JSON.stringify(data[i + flightLength*6]._value)).substring(1,9)}</td>
                </tr>
            )
        }
        return rows

    }

    return (
        <div className='text-center'>
            <h1 className="font-bold text-6xl text-center p-8">Database Viewer</h1>
            <div className='flex justify-center'>
                <button onClick={getFlights} className="bg-black mx-4 rounded-xl text-white font-semibold text-xl h-16 w-48 text-center">Load Data</button>
                <form>
                    <select onChange={handleChange} className='p-2 mx-4 h-16 border-slate-100 border-2 w-52 rounded-xl'>
                        {flights ? flights.flights.map((item) => (
                            <option key={item.flight_id} value={item.flight_id}>{item._value}</option>
                        )) : <option value={""} disabled >No data</option>}
                    </select>
                </form>
            </div>

            <div>
                {data ? <div className='m-8 rounded-xl shadow-2xl'>{displayData()}</div> : <div></div>}
            </div>
        </div>
    )
}