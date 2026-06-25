import { useState, useEffect } from "react";
import { type Ride } from "./ridecard";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../context/TicketContext";
import { useAlert } from "../context/AlertContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride | null;
  selectedDate: string;
  userPickup?: string; 
  userDestination?: string;
}

// Dictionary to make the locked inputs look professional!
const locationLabels: Record<string, string> = {
  "town": "CBD - KENCOM",
  "maasai": "Rongai - Maasai Mall",
  "cleanshelf": "Rongai - Cleanshelf",
  "langata": "Langata - T-Mall",
  "karen": "Karen - Galleria",
  "mmu": "Multimedia University",
  "strathmore": "Strathmore University",
  "uon": "UoN Main Campus",
  "cuea": "CUEA",
  "copa": "Cooperative University",
  "ksl": "Kenya School of Law",
  "tangaza": "Tangaza University",
  "africa": "Africa Nazarene University"
};

const BookingModal = ({ isOpen, onClose, ride, userPickup, userDestination }: BookingModalProps) => {

  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [seatNumber, setSeatNumber] = useState("1");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { bookTicket } = useTickets();
  const { showAlert } = useAlert();
  
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setPhoneNumber(""); 
      setSeatNumber("1");
      setPickupLocation(userPickup || "");
      setDestination(userDestination || "");
      setError("");
    }
  }, [isOpen, userPickup, userDestination]);

  if (!isOpen || !ride) return null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // M-PESA validation
    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    const phoneRegex = /^(?:254|\+254|0)?(7|1)[0-9]{8}$/;

    if (!phoneRegex.test(cleanPhone)) {
      setError("Please enter a valid Kenyan M-Pesa number.");
      return; 
    }
    setStep('processing');

    setTimeout(async () => {
      try {
        await bookTicket({
          rideId: ride.id,
          seatNumber: seatNumber,
          pickupLocation: pickupLocation, 
          destination: destination
        }); 
        setStep('success');
      } catch (err: any) {
        showAlert({
          title: "Unable to save your ticket",
          message: err?.message || "There was an issue saving your ticket. Please try again.",
          type: "error" 
        });
        setStep('details'); 
      }
    }, 3000); 
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity flex items-center justify-center p-4 overflow-y-auto"
        onClick={step === 'processing' ? undefined : onClose} 
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 transform transition-all"
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <h3 className="text-lg font-bold text-gray-900">
              {step === 'success' ? 'Booking Confirmed!' : 'Confirm Booking'}
            </h3>
            {step !== 'processing' && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>

          <div className="p-6">
            {step === 'details' && (
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-blue-800 uppercase">Shuttle {ride.vehicle_plate}</span>
                    <span className="text-sm font-bold text-blue-900">{ride.departure_time}</span>
                  </div>
                  <p className="text-sm text-blue-700">Captain: {ride.driver_name}</p>
                  <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Fare</span>
                    <span className="text-xl font-black text-gray-900">KSh {ride.price}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Seat</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    required
                  >
                    {[...Array(14)].map((_, i) => (
                      <option key={i + 1} value={(i + 1).toString()}>Seat {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-semibold cursor-not-allowed focus:outline-none"
                    value={locationLabels[pickupLocation] || pickupLocation}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-semibold cursor-not-allowed focus:outline-none"
                    value={locationLabels[destination] || destination}
                    readOnly
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">+254</span>
                    </div>
                    <input 
                      type="tel" 
                      className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      placeholder="712 345 678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  {error ? (
                    <p className="text-red-500 text-sm font-medium mt-2 animate-pulse">{error}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1 mb-4">You will receive an STK prompt on your phone to enter your PIN.</p>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center gap-2 shadow-md"
                >
                  Pay KSh {ride.price} with M-Pesa
                </button>
              </form>
            )}

            {step === 'processing' && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mb-4"></div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Awaiting Payment</h4>
                <p className="text-gray-500">
                  Please check your phone. Enter your M-Pesa PIN to complete the booking.
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Seat Secured!</h4>
                <p className="text-gray-500 mb-6">
                  Your payment was successful. We've sent the digital ticket to your email.
                </p>
                
                <button 
                    onClick={() => {
                    onClose(); 
                    navigate("/tickets"); 
                    }}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                      View My Tickets
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default BookingModal;