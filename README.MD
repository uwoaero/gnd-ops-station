# Ground Ops Station

## Get Started

### Start Ground Station 

1. 
    ```
    docker-compose build
    ```

2. 
    ```
    docker compose up
    ```

2. Configure InfluxDB
    Go to localhost:8086 and sign in using the login information:
    - Username: westernaerodesign
    - Password: Award Shelf
    - Generate a token and paste it into the .env file

3. View Frontend at localhost:3000
    
4. Backend is hosted at localhost:5000

### For telemetry injestion only:

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

4. Plug in flight controller to usb or usb-c

5. Find USB port name:
    - Windows: check "Ports (COM & PLT)" in Device Manager
    - Mac: idk but probably some "/dev/tty" thing

6. Edit connection_string in telemetry-injestion.py

7. Start ingestion script:
    ```
    python telemetry-injestion.py
    ```
