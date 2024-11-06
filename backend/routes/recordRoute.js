//import kafka library
import { Kafka } from 'kafkajs'

import 'dotenv/config'

import { InfluxDB, Point } from '@influxdata/influxdb-client'

const bucket = "Telemetry"
const org = "westernaerodesign"
const url = "http://influxdb:8086"
const influxdb = new InfluxDB({ url: url, token: process.env.INFLUXDB_TOKEN })
const writeApi = influxdb.getWriteApi(org, bucket)

import express from "express"
const router = express.Router();

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
  await consumer.subscribe({ topic: 'telemetry'})

  //start consuming messages and printing in console
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      //if recording data
      if (isRunning) {
        if (message.value) {

          //get message
          const data = JSON.parse(message.value.toString())

          //save to influx as a Point
          const point = new Point('flight')
            .tag('flight_id', id)
            .floatField('ground_speed', parseFloat(data.ground_speed))
            .floatField('air_speed', parseFloat(data.air_speed))
            .floatField('battery_voltage', parseFloat(data.battery_voltage))
            .floatField('longitude', parseFloat(data.longitude))
            .floatField('latitude', parseFloat(data.latitude))
            .floatField('altitude', parseFloat(data.altitude))
            .stringField("tag", tag.toLocaleString())
          console.log(` ${point}`)

          writeApi.writePoint(point)
        }
      }
    },
  })
}

//catch any errors
consume().catch(console.error);

//determines if recording data or not
let isRunning = false;

//flight tag
let tag = 0;
let id = 0;

//start recording data
router.get('/start', (req, res) => {

  //if already recording
  if (isRunning) {
    return res.status(400).json({
      message: 'already running',
    });
  }

  //if not, start recording and create id and tag
  isRunning = true;
  tag = new Date(Date.now() - (5 * 60 * 60 * 1000));
  id = Math.floor(Math.random() * 10000000000000001)

  res.json({
    message: 'started',
  });
});

//stop recording data
router.get('/stop', (req, res) => {

  //if not recording
  if (!isRunning) {
    return res.status(400).json({
      message: 'not running',
    });
  }

  //if recording, stop
  isRunning = false;

  res.json({
    message: 'stopped',
  });
});

//returns if data is being recorded
router.get('/status', (req, res) => {
  res.json({
    isRunning: isRunning,
  });
});

export {router, consume};
