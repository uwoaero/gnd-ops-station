from pymavlink import mavutil
import serial
from kafka import KafkaProducer
import json

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

#connect to flight controller using mavlink
def connect():
    print("connecting...")
    connection = mavutil.mavlink_connection('com9')
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
    attitude_msg = {}
    sys_status_msg = {}
    gps_msg = {}
    #loop constantly
    while True:
        #get message
        msg = connection.recv_match(blocking=True)
        if not msg:
            continue
        #send messgae to database and frontend
        if(msg.get_type() in ["ATTITUDE", "SYS_STATUS", "GLOBAL_POSITION_INT"]):
            if(msg.get_type() == "ATTITUDE"):
                attitude_msg = msg.to_dict()
                # print(attitude_msg)
            if(msg.get_type() == "SYS_STATUS"):
                sys_status_msg = msg.to_dict()
                # print(sys_status_msg)
            
            if(msg.get_type() == "GLOBAL_POSITION_INT"):
                gps_msg = msg.to_dict()
                # print(gps_msg)
            # If you want to include all fields
            if(attitude_msg and sys_status_msg and gps_msg):
                telemetry = {**attitude_msg, **sys_status_msg, **gps_msg}
                sendData(telemetry, producer)
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