import { useState } from "react";
import ProfileSidebar from "../components/profileSidebar";
import { useLocation } from "react-router-dom";
import RideCard, { type Ride } from "../components/ridecard";
import BookingModal from "../components/bookingModal";
import { useAuth } from "../context/AuthContext";

//Dummy data for now - will fetch this from the backend later
const DUMMY_RIDES: Ride[] = [
  { id: "r1", driverName: "Karis", vehiclePlate: "KCX 123J", departureTime: "07:00 AM", seatsAvailable: 14, price: 50 },
  { id: "r2", driverName: "Ian", vehiclePlate: "KDG 456K", departureTime: "07:30 AM", seatsAvailable: 2, price: 50 },
  { id: "r3", driverName: "Andrew", vehiclePlate: "KDL 789M", departureTime: "08:00 AM", seatsAvailable: 10, price: 50 },
];

const Dashboard = () => {
  const location = useLocation();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(location.state?.openSidebar || false);
  const [hasSearched, setHasSearched] = useState(false);
  //Track the modal visibility and the selected ride
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  // We will use this to show an error if they select a past date - but for now we just reset it on every search
  const [dateError, setDateError] = useState("");
  const todayString = new Date().toISOString().split("T")[0];
  const { user } = useAuth();
  const rawName = user?.email?.split('@')[0] || "Comrade";
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const initial = displayName.charAt(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDateError("");
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight so only compared to the day

    if(selectedDate.getTime() < today.getTime()) {
      setDateError("You cannot book a ride for a date in the past. Please select a valid departure date.");
      setHasSearched(false);  
      return;
    }
    console.log("Searching for rides:", { origin, destination, date });
    setHasSearched(true);

    // Later: We will filter available rides based on these inputs!
  };

  const handleBookRide = (rideId: string) => {
    // 1. Find the ride the user clicked from our dummy database
    const rideToBook = DUMMY_RIDES.find(ride => ride.id === rideId);
    
    if (rideToBook) {
      // 2. Set it as the active ride and open the modal
      setSelectedRide(rideToBook);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[url('/src/assets/upperhill.jpg')] bg-cover bg-center bg-fixed">

      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
        {/*BOOKING MODAL */}
        <BookingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          ride={selectedRide} 
          selectedDate={date}
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
                Hello, {displayName}
              </span>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold shadow-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
              >
                {initial}
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

                {/*DATE INPUT SECTION */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <input 
                    type="date" 
                    min={todayString} //validation: Grays out past dates in the calendar picker
                    // Turn the border red if there is an error!
                    className={`w-full px-4 py-3 border ${dateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:ring-2 outline-none text-gray-700 transition-colors`} 
                    value={date} 
                    onChange={(e) => {
                      setDate(e.target.value);
                      setDateError(""); // Clear the error instantly when the user types a new date
                    }} 
                    required 
                  />
                  {/* Conditionally render the error message */}
                  {dateError && (
                    <p className="text-red-500 text-sm font-medium mt-2 animate-pulse">
                      {dateError}
                    </p>
                  )}

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

         {/* DYNAMIC CONTENT AREA */}
          <div className="mt-12">
            {!hasSearched ? (
              // Show this if they HAVEN'T searched yet
              <>
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">Your Trips</h3>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg">
                  <p className="text-gray-600 font-medium">You have no upcoming rides booked.</p>
                  <p className="text-sm text-gray-500 mt-1">Use the search above to find your next shuttle.</p>
                </div>
              </>
            ) : (
              // Show this if they HAVE searched
              <>
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">
                  Available Shuttles
                </h3>
                <div className="flex flex-col gap-4">
                  {DUMMY_RIDES.map((ride) => (
                    <RideCard 
                      key={ride.id} 
                      ride={ride} 
                      onBook={handleBookRide} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;