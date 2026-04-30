// 1. Define the TypeScript shape for ride data
export interface Ride {
  id: string;
  driverName: string;
  vehiclePlate: string;
  departureTime: string;
  seatsAvailable: number;
  price: number;
}

interface RideCardProps {
  ride: Ride;
  onBook: (rideId: string) => void;
}

const RideCard = ({ ride, onBook }: RideCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      
      {/* Left side: Ride Details */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {ride.departureTime}
          </span>
          {ride.seatsAvailable <= 3 && (
            <span className="text-red-600 text-xs font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Only {ride.seatsAvailable} seats left!
            </span>
          )}
        </div>
        
        <h4 className="text-lg font-bold text-gray-900">
          Shuttle: {ride.vehiclePlate}
        </h4>
        <p className="text-sm text-gray-500">
          Captain: {ride.driverName}
        </p>
      </div>

      {/* Right side: Price & Booking */}
      <div className="flex flex-row sm:flex-col items-center justify-between sm:items-end w-full sm:w-auto gap-4 sm:gap-2 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-500">Fixed Fare</p>
          <p className="text-xl font-black text-gray-900">KSh {ride.price}</p>
        </div>
        
        <button 
          onClick={() => onBook(ride.id)}
          className="bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Book Seat
        </button>
      </div>

    </div>
  );
};

export default RideCard;