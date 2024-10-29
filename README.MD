# Ground Ops Station

## Get Started

### Start Kafka and InfluxCB

1. Start kafka and infuxdb using docker
    ```
    docker-compose up -d
    ```

2. Configure InfluxDB
    Go to localhost:8086 and sign in using the login information:
    - Username: westernaerodesign
    - Password: Award Shelf
    - Generate a token and paste it into the .env file
    
### Setting up a Python Virtual Environment

1. Create a virtual environment:
   ```
   cd backend
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
    cd frontend
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