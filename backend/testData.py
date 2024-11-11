from pymavlink import mavutil
import serial
import random
from kafka import KafkaProducer
import json
import time 

#starts kafka connection
def startKafka():

    #initialize kafka producer
    producer = KafkaProducer(
        bootstrap_servers=['broker:29092'],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    print("connected to kafka")
    return producer

#send data to kafka pipeline
def sendData(data, producer):
    producer.send("test-telemetry", data)



# Dummy data generator function
def generate_multiple_dummy_data(producer):
    while True:
        snapshot = {
            "ground_speed": round(random.uniform(10, 50), 2),
            "air_speed": round(random.uniform(10, 80), 2),
            "battery_voltage": round(random.uniform(11, 12.6), 2),
            "longitude": round(random.uniform(-180, 180), 6),
            "latitude": round(random.uniform(-90, 90), 6),
            "altitude": round(random.uniform(100, 1000), 2),
            "timestamp": int(time.time())
        }

        # Send the snapshot to Kafka
        sendData(snapshot, producer)
        print(f"Sent to kafka: {json.dumps(snapshot)}")
        
        time.sleep(1)


def main():
    print("starting...")
    
    producer = startKafka()
    generate_multiple_dummy_data(producer)
    producer.flush()

if __name__ == "__main__":
    main()
