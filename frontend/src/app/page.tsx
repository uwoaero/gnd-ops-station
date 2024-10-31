//import kafka library
import { Kafka } from 'kafkajs'

//initializes kafka connection for this consumer
const kafka = new Kafka({
  clientId: 'gnd-station-frontend',
  brokers: ['localhost:9092'],
})

const consume = async () => {

  //create consumer instance to be part of a consumer group
  const consumer = kafka.consumer({ groupId: 'gnd-station-group' })

  //connect to broker
  await consumer.connect()

  //subscribe to telemetry topic
  await consumer.subscribe({ topic: 'telemetry', fromBeginning: true })
  
  //start consuming messages and printing in console
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if(message.value){
        console.log({
          value: message.value.toString(),
        })
      } else {
        console.log("damn")
      }
    },
  })
}


export default function Home() {

  return (
    <div>
      WESTERN AERO DESIGN GROUND STATION
      <p>
        GROUND SPEED
      </p>
      <p>
        AIR SPEED
      </p>
      <p>
        BATTERY VOLTAGE
      </p>
      <p>
        LON/LAT
      </p>
      <p>
        ALTITUDE
      </p>

    </div>
  );
}
