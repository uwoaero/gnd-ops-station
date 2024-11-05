//import kafka library
import { Kafka } from 'kafkajs'

import express, { query } from "express"
const app = express();

import 'dotenv/config'


import { InfluxDB, Point } from '@influxdata/influxdb-client'

const bucket = "Telemetry"
const org = "westernaerodesign"
const url = "http://influxdb:8086"
const influxdb = new InfluxDB({ url: url, token: process.env.INFLUXDB_TOKEN })
const writeApi = influxdb.getWriteApi(org, bucket)

//initializes kafka connection for this consumer
const kafka = new Kafka({
  clientId: 'backend',
  brokers: ['broker:29092'],
})

//consume kafka messages
const consume = async () => {

  //create consumer instance to be part of a consumer group
  const consumer = kafka.consumer({ groupId: 'backend' })

  //connect to broker
  await consumer.connect()

  //subscribe to telemetry topic
  await consumer.subscribe({ topic: 'telemetry', fromBeginning: true })

  //start consuming messages and printing in console
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (isRunning) {
        const point = new Point('flight')
          .tag('flight_id', id)
          .floatField('value', parseFloat(message.value))
          .stringField("tag", tag.toLocaleString())
        console.log(` ${point}`)

        writeApi.writePoint(point)
        console.log({
          tag: tag.toLocaleString(),
          value: message.value.toString(),
        })
      }
    },
  })
}

//catch any errors
consume().catch(console.error);

let isRunning = false;
let tag = 0;
let id = 0;

app.get('/', (req, res) => {
  res.send('<h1>SEVERRRRRRRRRRRr</h1>');
});

// Example specifying the port and starting the server
const port = 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/start', (req, res) => {
  if (isRunning) {
    return res.status(400).json({
      message: 'already running',
    });
  }

  isRunning = true;
  tag = new Date(Date.now() - (5 * 60 * 60 * 1000));
  id = Math.floor(Math.random() * 10000000000000001)

  res.json({
    message: 'started',
  });
});

app.get('/stop', (req, res) => {
  if (!isRunning) {
    return res.status(400).json({
      message: 'Counter is not running',
    });
  }

  isRunning = false;

  res.json({
    message: 'stopped',
  });
});

app.get('/status', (req, res) => {
  res.json({
    isRunning: isRunning,
  });
});

let dataType = "dummy"

app.get("/dummydata", (req, res) => {
  dataType = "dummy"
  res.json({
    dataType: dataType,
  });
})

app.get("/realdata", (req, res) => {
  dataType = "real"
  res.json({
    dataType: dataType,
  });
})

const queryApi = influxdb.getQueryApi(org)

const myQuery = async () => {
  const fluxQuery = 'from(bucket: "Telemetry") |> range(start: 0)'
  const flights = []

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values)
    // console.log(
    //   `${o._time} ${o._measurement} for (${o.flight_id}): ${o._field}=${o._value}`
    // )
    flights.push(o)
  }

  return flights
}

app.get("/flights", async (req, res) => {
  const flights = []

  const query = await myQuery()
  console.log(query)
  for (let i = 0; i < query.length; i++) {
    console.log(query[i].flight_id)
    flights.push(query[i].flight_id)
  }

  res.json({ flights: flights })

})

app.get("/:flight_id", async (req, res) => {
  console.log("GETTING ID")
  console.log(req.params.flight_id)

  const flights = await myQuery()
  const selectedFlight = []

  for (let i = 0; i < query.length; i++) {
    if(req.params.flight_id == flights[i].id){
      selectedFlight.push(flights[i])
    }
  }

  res.json({ selectedFlight: selectedFlight })
})