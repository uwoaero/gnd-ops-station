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
      if (isRunning) {
        console.log({
          tag: tag,
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
  tag = new Date();

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