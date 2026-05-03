// 1. Define the TypeScript shape for ride data
export interface Ride {
id: string;
  driver_name: string;
  vehicle_plate: string;
  departure_time: string;
  seats_available: number;
  price: number;
  origin: string;
  destination: string;
  departure_date: string;
}

interface RideCardProps {
  ride: Ride;
  onBook: (rideId: string) => void;
}

const RideCard = ({ ride, onBook }: RideCardProps) => {
  const formatLocation = (loc: string) => {
    const locations: Record<string, string> = {
      town: "CBD", maasai: "Rongai - Maasai Mall", cleanshelf: "Rongai - Cleanshelf", 
      langata: "Langata - T-Mall", karen: "Karen - Galleria", mmu: "Multimedia University", strathmore: "Strathmore University", 
      uon: "UoN Main Campus", cuea: "CUEA", copa: "Cooperative University", ksl: "Kenya School of Law", 
      tangaza: "Tangaza University", africa: "Africa Nazarene University"
    };
    return locations[loc] || loc;
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
      
      {/* Route and Time Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl font-bold text-gray-900">{ride.departure_time}</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {ride.seats_available} Seats Left
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 font-medium mb-4">
          <span>{formatLocation(ride.origin)}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          <span>{formatLocation(ride.destination)}</span>
        </div>

        {/* DRIVER & VEHICLE INFO (This is what was missing!) */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Captain</p>
              <p className="font-bold text-gray-900">{ride.driver_name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Vehicle</p>
              <p className="font-bold text-gray-900">{ride.vehicle_plate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price and Book Button */}
      <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
        <div className="text-left md:text-right mb-0 md:mb-4">
          <p className="text-gray-500 text-sm font-medium">Price per seat</p>
          <p className="text-2xl font-bold text-green-600">KSh {ride.price}</p>
        </div>
        
        <button 
          onClick={() => onBook(ride.id)}
          disabled={ride.seats_available === 0}
          className={`px-8 py-3 rounded-lg font-bold transition-all w-full md:w-auto ${
            ride.seats_available === 0 
              ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {ride.seats_available === 0 ? "Full" : "Book Seat"}
        </button>
      </div>

    </div>
  );
};

export default RideCard;