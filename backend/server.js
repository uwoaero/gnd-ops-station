//import kafka library
import { Kafka } from 'kafkajs'

import express from "express"
const app = express();

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
      console.log({
        value: message.value.toString(),
      })
    },
  })
}

//catch any errors
consume().catch(console.error);

app.get('/', (req, res) => {
  res.send('<h1>SEVERRRRRRRRRRRr</h1>');
});

import recordingRoutes from "./routes/record.js"
app.use("/record", recordingRoutes)

// Example specifying the port and starting the server
const port = 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});