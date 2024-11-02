//import kafka library
import { Kafka } from 'kafkajs'

const setupKafka = async() => {
  //initializes kafka connection for this consumer
  const kafka = new Kafka({
    clientId: 'gnd-station-frontend',
    brokers: ['broker:9092'],
  })

  return kafka
}

const subscribe = async(kafka) => {

  //create consumer instance to be part of a consumer group
  const consumer = kafka.consumer({ groupId: 'gnd-station-group' })

  //connect to broker
  await consumer.connect()

  //subscribe to telemetry topic
  await consumer.subscribe({ topic: 'telemetry', fromBeginning: true })

  return consumer
}

const consume = async (consumer) => {
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

module.exports = {setupKafka, subscribe, consume}