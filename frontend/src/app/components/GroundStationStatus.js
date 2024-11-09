'use client'
import { useState, useEffect } from 'react';

function GroundStationStatus() {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const checkRecordingStatus = async () => {
      const recordingStatus = await fetchRecordingStatus();
      setIsRecording(recordingStatus);
    };

    checkRecordingStatus();
  }, []);

  const fetchRecordingStatus = async () => {
    return true;
  };

  return (
    <div style={{ padding: '20px', fontSize: '18px' }}>
      <p>
        Ground Station Status: 
        <span style={{ 
          color: isRecording ? 'green' : 'red', 
          fontWeight: 'bold', 
          marginLeft: '8px' 
        }}>
          {isRecording ? 'Recording' : 'Not Recording'}
        </span>
      </p>
    </div>
  );
}

export default GroundStationStatus;