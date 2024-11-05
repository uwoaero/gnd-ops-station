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
        bootstrap_servers=['localhost:9092'],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    print("connected to kafka")
    return producer

#send data to kafka pipeline
def sendData(data, producer):
    producer.send("telemetry", data)



# Dummy data generator function
def generate_multiple_dummy_data(producer, seconds=20):
    data = {
        "ground_speed": [],
        "air_speed": [],
        "battery_voltage": [],
        "longitude": [],
        "latitude": [],
        "altitude": [],
        "timestamp": []
    }

    for _ in range(seconds):
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
        print(f"Sent to Kafka: {snapshot}")

        
        time.sleep(1)


def main():
    
    producer = startKafka()
    producer.flush()
    generate_multiple_dummy_data(producer)
if __name__ == "__main__":
    main()
