# Ground Ops Station

## Get Started

### Start Grafana & InfluxDB

1. Start kafka:
    cd into kafka folder

    Start zookeeper:
    ```
    .\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
    ```

    (In a seperate terminal) Start kafka:
    ```
    .\bin\windows\kafka-server-start.bat .\config\server.properties
    ```

2. Setup InfluxDB
    - cd into InfluxData/influxdb
    - start influxdb:

    ```
    .\influxd
    ```
    
    Go to localhost:8086 and setup influxdb
    - Create the user and org as "westernaerodesign"
    - Get an InfluxDB_Token and add to .env file
    
### Setting up a Python Virtual Environment

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install requirements:
   ```
   pip install -r requirements.txt
   ```

### Install Node libraries
Install kafka:
    ```
    npm i kafkajs
    ```


### Start Ingestion

1. Plug in flight controller to usb or usb-c

2. Find USB port name:
    - Windows: check "Ports (COM & PLT)" in Device Manager
    - Mac: idk but probably some "/dev/tty" thing

3. Edit connection_string in ground-station.py

3. Start ingestion script:
    ```
    python ground-station.py
    ```

4. Start js server:
    ```
    node server.js
    ```