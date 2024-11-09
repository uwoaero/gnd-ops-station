'use client'

import React, { useEffect, useState } from 'react'
import axios from "axios";

export default function Page() {
    const [flights, setFlights] = useState();
    const [data, setData] = useState(null);

    const getFlights = async () => {
        try {
            const response = await fetch('http://localhost:5000/database/flights');
            const data = await response.json();
            setFlights(data);
        } catch (error) {
            console.error('Error fetching flight data:', error);
        }

    }

    const handleChange = async (e) => {
        console.log(e.target.value)

        const response = await axios.get(`http://localhost:5000/database/7414128267293123`)
        const data = await response.data;
        // setData(data)
        console.log(data)

    }

    return (
        <div>
            <button onClick={getFlights}>Load Data</button>
            {/* <h1>{flights ? JSON.stringify(flights.flights) : "no data"}</h1> */}

            <form>
                <select onChange={handleChange}>
                    {flights ? flights.flights.map((item) => (
                        <option key={item.flight_id} value={item.flight_id}>{item._value}</option>
                    )) : <option value={""} disabled>No data</option>}
                </select>
            </form>
        </div>
    )
}