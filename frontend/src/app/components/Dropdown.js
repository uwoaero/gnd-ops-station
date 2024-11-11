// components/Dropdown.js
const Dropdown = ({ className }) => {
    return (
      <div className={`relative ${className}`}>
        <label htmlFor="options" className="block text-sm font-medium text-white mb-1">
          Choose data ingestion:
        </label>
        <select
          id="options"
          className="bg-gray-700 text-white p-2 rounded-lg"
        >
          <option value="" disabled>Select an option</option>
          <option value="Option 1">Flight Controller</option>
          <option value="Option 2">Dummy Database</option>
        </select>
      </div>
    );
  };
  
  export default Dropdown;
  