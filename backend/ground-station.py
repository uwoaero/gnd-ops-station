from pymavlink import mavutil
import serial

from kafka import KafkaProducer
import json

import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

from dotenv import load_dotenv

#load influx token
load_dotenv()
token = os.environ.get('INFLUXDB_TOKEN')
if token == None:
  print("booo")

#connect to influx
org = "Ground Station"
url = "http://influxdb:8086"
bucket="Telemetry"


#initialize InfluxDB client
client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
write_api = client.write_api(write_options=SYNCHRONOUS)

#save data to influxdb
def saveData(data):
  point = (
    Point("flight")
    
    #add data and time to tag, Ex flight{data}{time}
    .tag("flight", "flight2")
    .field("roll", data.roll)
    .field("pitch", data.pitch)
    .field("yaw", data.yaw)
    .field("rollspeed", data.rollspeed)
    .field("pitchspeed", data.pitchspeed)
    .field("yawspeed", data.yawspeed)
  )

  #write data to database
  write_api.write(bucket=bucket, org="Ground Station", record=point)
  print(point)

#starts kafka connection
def startKafka():

    #initialize kafka producer
    producer = KafkaProducer(
        bootstrap_servers=['broker:9092'],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    return producer

#send data to kafka pipeline
def sendData(data, producer):
    producer.send("telemetry", data)

#connect to flight controller using mavlink
def connect():
    print("connecting...")
    connection = mavutil.mavlink_connection('com6')
    print("awating heartbeat")
    connection.wait_heartbeat()
    print("yippee")

    return connection

#requests data stream from the flight controller
def requestData(connection):
    connection.mav.request_data_stream_send(
        connection.target_system,
        connection.target_component,
        mavutil.mavlink.MAV_DATA_STREAM_ALL,
        30,
        1 
    )

#main loop to receive data
def getData(connection, producer):

    #loop constantly
    while True:

        #get message
        msg = connection.recv_match(blocking=True)
        if not msg:
            continue

        #send messgae to database and frontend
        if msg.get_type() == 'ATTITUDE':
            saveData(msg)
            sendData(msg.to_dict(), producer)


def main():
    #connect to flight controller and kafka
    connection = connect()
    producer = startKafka()

    #receive data
    requestData(connection)
    getData(connection, producer)
    producer.flush()

if __name__ == "__main__":
    main()
