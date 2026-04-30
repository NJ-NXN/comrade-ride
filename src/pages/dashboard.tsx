import { useState } from "react";
import ProfileSidebar from "../components/profileSidebar";

const Dashboard = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for rides:", { origin, destination, date });
    // Later: We will filter available rides based on these inputs!
  };

  return (
    <div className="relative min-h-screen w-full bg-[url('/src/assets/upperhill.jpg')] bg-cover bg-center bg-fixed">

        <ProfileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Main Content Wrapper: z-10 keeps everything above the blur layer */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        
        {/* Top Navigation Bar */}
        <header className="backdrop-blur px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
            <h1 className="text-xl font-bold text-blue-200">Comrade Connect</h1>
            
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-sm text-blue-100 font-medium">
                Hello, User
              </span>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold shadow-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
              >
                U
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          
          {/* Welcome Section */}
          <div className="mb-8 mt-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
              Where are you heading?
            </h2>
            <p className="text-gray-200 mt-1 font-medium drop-shadow">
              Book your seat and skip the matatu madness.
            </p>
          </div>

          {/* The Booking Form Card */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 lg:p-8">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Pick-up Location Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pick-up Location
                  </label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all text-gray-700"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Stage...</option>
                    <option value="town">CBD - KENCOM</option>
                    <option value="maasai">Rongai - Maasai Mall</option>
                    <option value="cleanshelf">Rongai - Cleanshelf</option>
                    <option value="langata">Langata - T-Mall</option>
                    <option value="karen">Karen - Galleria</option>
                  </select>
                </div>

                {/* Drop-off Location Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Campus
                  </label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all text-gray-700"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Campus...</option>
                    <option value="mmu">Multimedia University</option>
                    <option value="strathmore">Strathmore University</option>
                    <option value="uon">UoN Main Campus</option>
                    <option value="cuea">CUEA</option>
                    <option value="copa">Cooperative University</option>
                    <option value="ksl">Kenya School of Law</option>
                    <option value="tangaza">Tangaza University</option>
                    <option value="africa">Africa Nazarene University</option>
                  </select>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button 
                  type="submit" 
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Find Shuttles
                </button>
              </div>
            </form>
          </div>

          {/* Upcoming Trips Section */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">Your Trips</h3>
            
            {/* Made this card slightly transparent to blend with the background */}
            <div className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* A simple calendar icon SVG */}
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <p className="text-gray-600 font-medium">You have no upcoming rides booked.</p>
              <p className="text-sm text-gray-500 mt-1">Use the search above to find your next shuttle.</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;