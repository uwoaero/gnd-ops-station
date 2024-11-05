//import kafka capabilities
const { setupKafka, subscribe, consume } = require('./kafkaConsumer.js')

//setup kafka connection
const kafka = setupKafka()
const consumer = subscribe(kafka)

export default function Home() {
  consume(consumer)

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
