# Ground Ops Station

## Get Started

### Start Grafana & InfluxDB

1. Start containers (ensure docker is installed and running):
    ```
    docker-compose up -d
    ```

2. Setup InfluxDB
    - Go to localhost:8086 and setup influxdb

3. Setup Grafana
    - Go to localhost:3000 and setup grafana
    
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

### Start Ingestion

1. Plug in flight controller to usb or usb-c

2. Find USB port name:
    - Windows: check "Ports (COM & PLT)" in Device Manager
    - Mac: idk but probably some "/dev/tty" thing

3. Edit connection_string in telemetry_ingestion.py

3. Start gngestion script:
    ```
    python telemetry_ingestion.py
    ```