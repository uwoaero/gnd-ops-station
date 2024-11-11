function GroundStationStatus({recording}) {

  return (
    <div className="px-2">
      <p className="text-black text-xl font-bold">
        Status: 
        <span style={{ 
          color: recording ? 'green' : 'red', 
          fontWeight: 'bold', 
          marginLeft: '8px' 
        }}>
          {recording ? 'Recording' : 'Not Recording'}
        </span>
      </p>
    </div>
  );
}

export default GroundStationStatus;