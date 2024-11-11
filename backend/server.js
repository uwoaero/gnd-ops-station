import express from "express"
const app = express();

//import kafka library
import { Kafka } from 'kafkajs'

import 'dotenv/config'

import { InfluxDB, Point } from '@influxdata/influxdb-client'

import cors from 'cors';
app.use(cors());
console.log("using cors...")

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

//create consumer instance to be part of a consumer group
const consumer = kafka.consumer({ groupId: 'backend' })

//consume kafka messages
const consume = async () => {

  //connect to broker
  await consumer.connect()

  //subscribe to telemetry topic
  await consumer.subscribe({ topic: "test-telemetry" })

  //start consuming messages and printing in console
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      //if recording data
      if (message.value) {
        //get message
        const data = JSON.parse(message.value.toString())

        //SEND TO FRONTEND VIA WEBSOCKET

        //if saving to database
        if (getIsRunning() && getDataType() == "test-telemetry") {
          const time = new Date()

          //save to influx as a Point
          const point = new Point('flight')
            .tag('flight_id', getId())
            .floatField('ground_speed', parseFloat(data.ground_speed))
            .floatField('air_speed', parseFloat(data.air_speed))
            .floatField('battery_voltage', parseFloat(data.battery_voltage))
            .floatField('longitude', parseFloat(data.longitude))
            .floatField('latitude', parseFloat(data.latitude))
            .floatField('altitude', parseFloat(data.altitude))
            .stringField("tag", getTag().toLocaleString())
            .stringField("data_time", time.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: false }))
          console.log(` ${point}`)

          writeApi.writePoint(point)
        }
      }

    },
  })
}

app.get('/', (req, res) => {
  res.send('<h1>SEVERRRRRRRRRRRr</h1>');
});

const port = 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import databaseRoutes from "./routes/databaseRoute.js"
app.use("/database", databaseRoutes)

import { router as recordRoutes, getIsRunning, getId, getTag, } from "./routes/recordRoute.js"
app.use("/record", recordRoutes)


import { router as sourceRoutes, getDataType } from "./routes/sourceRoute.js"
app.use("/source", sourceRoutes)

consume().catch(console.error);

