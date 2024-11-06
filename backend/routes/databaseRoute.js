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
const myQuery = async (id) => {
  const fluxQuery = 'from(bucket: "Telemetry") |> range(start: 0)'
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
  const flights = []

  //queries entire database
  const query = await myQuery()
  console.log(query)

  //only get unique flght ids... doesn't work
  for (let i = 0; i < query.length; i++) {
    console.log(query[i].flight_id)
    flights.push(query[i].flight_id)
  }

  res.json({ flights: flights })
})

//get specific flight data
router.get("/:flight_id", async (req, res) => {

  const flights = await myQuery()
  const selectedFlight = []

  for (let i = 0; i < flights.length; i++) {
    if(req.params.flight_id == flights[i].id){
      selectedFlight.push(flights[i])
    }
  }

  res.json({ selectedFlight: selectedFlight })
})

export default router;
