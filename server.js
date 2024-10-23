//import kafka library
const { Kafka } = require('kafkajs')

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
      console.log({
        value: message.value.toString(),
      })
    },
  })
}

//catch any errors
consume().catch(console.error);