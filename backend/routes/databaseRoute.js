import 'dotenv/config'

import { InfluxDB, Point } from '@influxdata/influxdb-client'

const bucket = "Telemetry"
const org = "westernaerodesign"
const url = "http://influxdb:8086"
const influxdb = new InfluxDB({ url: url, token: process.env.INFLUXDB_TOKEN })
const queryApi = influxdb.getQueryApi(org)

import express from "express"
const router = express.Router();

//queries Telemetry bucket
const myQuery = async (fluxQuery) => {
  const flights = []

  //list all items 
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values)
    // console.log(
    //   `${o._time} ${o._measurement} for (${o.flight_id}): ${o._field}=${o._value}`
    // )
    flights.push(o)
  }

  return flights
}

//returns all flights
router.get("/flights", async (req, res) => {
  const allQuery = 'from(bucket: "Telemetry") |> range(start: 0) |> filter(fn: (r) => r._measurement == "flight" and r._field == "tag")'

  //queries entire database
  const query = await myQuery(allQuery)
  // console.log(query)

  //only get unique flght ids

  const flights_ids = new Set();

  const flights = query.filter(flight => {
    const { flight_id } = flight;

    if (!flights_ids.has(flight_id)) {
      flights_ids.add(flight_id)
      return true
    } else {
      return false
    }

  })

  res.json({ flights: flights })
})

//get specific flight data
router.get("/:flight_id", async (req, res) => {
  const id = req.params.flight_id
  let selectedFlight = "invalid"

  if(id.length == 16){
    const flightQuery = `from(bucket: "Telemetry") |> range(start: 0) |> filter(fn: (r) => r._measurement == "flight" and r.flight_id == "${id}")`

    selectedFlight = await myQuery(flightQuery)
    // console.log(selectedFlight)
  
  } else {
    selectedFlight = "invalid"
  }
  res.json({ selectedFlight: selectedFlight })


})

export default router;
