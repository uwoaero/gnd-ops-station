import localFont from "next/font/local";
import Button from '../components/Button';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen p-8 pb-20 bg-black-200 text-white`}>
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center">
        <img src="/logo.png" alt="Logo" className="h-20" />
        <h1 className="mt-2 text-xl text-center">Ground Station Interface</h1>
  
        <div className="flex justify-center gap-8 mt-8 max-w-screen-lg w-full">
  
          <div className="bg-white text-black rounded-lg shadow-md p-8 w-full max-w-lg space-y-6">
            <h2 className="text-lg font-bold text-center">Metrics</h2>
            <div className="space-y-2">
              <p><strong>Ground Speed:</strong> <span id="ground-speed">-</span></p>
              <p><strong>Air Speed:</strong> <span id="air-speed">-</span></p>
              <p><strong>Battery Voltage:</strong> <span id="battery-voltage">-</span></p>
              <p><strong>Longitude/Latitude:</strong> <span id="lon-lat">-</span></p>
              <p><strong>Altitude:</strong> <span id="altitude">-</span></p>
            </div>
          </div>
  
          <div className="flex flex-col items-center space-y-6 w-full max-w-lg">
            <div className="bg-gray-800 rounded-lg shadow-md w-full h-48 flex items-center justify-center">
              <p className="text-gray-400">FPV View (Placeholder)</p>
            </div>
  
            <div className="bg-gray-800 rounded-lg shadow-md w-full h-48 flex items-center justify-center">
              <img src="/model-plane.jpg" alt="Model Plane" className="h-full object-contain" />
            </div>
          </div>
        </div>
        <div className="bg-gray-700 text-white rounded-lg shadow-md w-full mt-8 p-8 relative z-20"> {/* Changed background color */}
            <h2 className="text-lg font-bold text-center">Recording and Database</h2>
            <p className="text-gray-300 text-center mt-4">Use the buttons below to control the system.</p>
            <div className="flex gap-4 mt-8 justify-center">
              <Button color="blue" onClick={() => alert('Going to Database')}>Go to Database</Button>
              <Button color="green" onClick={() => alert('Starting Recording')}>Start Recording</Button>
              <Button color="red" onClick={() => alert('Stopping Recording')}>Stop Recording</Button>
            </div>
          </div>
        </div>
      </div>
    </div>

  
    );
}
