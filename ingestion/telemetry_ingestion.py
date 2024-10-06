from pymavlink import mavutil
from pymavlink.mavutil import mavfile
from pymavlink.dialects.v20.ardupilotmega import *
from datetime import datetime, timedelta

import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
from dotenv import load_dotenv
load_dotenv()

# InfluxDB Setup
token = os.environ.get("INFLUXDB_TOKEN")
org = "westernaerodesign"
url = "http://localhost:8086"
bucket = 'flight'
write_client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
write_api = write_client.write_api(write_options=SYNCHRONOUS)

start_time = datetime.now()

def setup_connection(connection_string: str) -> mavfile:
    print(f"Connecting to {connection_string}")
    mav_connection: mavfile = mavutil.mavlink_connection(connection_string)
    print(f"Waiting for heartbeat...")
    mav_connection.wait_heartbeat()
    print(f"Successfully connected!")
    return mav_connection

def request_data_stream(mav_connection: mavfile):
    mav_connection.mav.request_data_stream_send(
        mav_connection.target_system,
        mav_connection.target_component,
        mavutil.mavlink.MAV_DATA_STREAM_ALL,
        30,  # 30 Hz
        1  # Start sending
    )

def save_telemetry(mav_connection: mavfile):
    while True:
        msg = mav_connection.recv_match(blocking=True)
        if msg is None:
            continue
        
        msg_dict = msg.to_dict()
        msg_dict['timestamp'] = datetime.now()
        msg_dict['mavpackettype'] = msg.get_type()
        
        if msg.get_type() in ['RAW_IMU', 'GPS_RAW_INT', 'RANGEFINDER', 'ATTITUDE']:
            timestamp = start_time + timedelta(milliseconds=msg_dict['time_boot_ms'])
            msg_dict = msg.to_dict()
            if msg.get_type() == 'ATTITUDE':
                point = (
                    Point("attitude")
                    .time(timestamp)  # Use the calculated timestamp
                    .field("roll", msg_dict["roll"])
                    .field("pitch", msg_dict["pitch"])
                    .field("yaw", msg_dict["yaw"])
                    .field("rollspeed", msg_dict["rollspeed"])
                    .field("pitchspeed", msg_dict["pitchspeed"])
                    .field("yawspeed", msg_dict["yawspeed"])
                )
                write_api.write(bucket=bucket, org=org, record=point)
                print(point)

def main():
    # TODO: add piece of code that automatically finds the port fo windows and macos
    connection_string = "com5" # for windows setup
    mav_connection = setup_connection(connection_string)
    request_data_stream(mav_connection)
    save_telemetry(mav_connection)

if __name__ == "__main__":
    main()