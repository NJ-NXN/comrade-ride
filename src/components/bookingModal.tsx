import { useState, useEffect } from "react";
import { type Ride } from "./ridecard";
import { useNavigate } from "react-router-dom";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride | null;
}

const BookingModal = ({ isOpen, onClose, ride }: BookingModalProps) => {

  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  
  // Whenever the modal opens, ensure we start at the 'details' step
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setPhoneNumber(""); // Reset phone number
    }
  }, [isOpen]);

  // Don't render anything if it's closed or if no ride is selected
  if (!isOpen || !ride) return null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate the delay of an M-Pesa STK Push
    setTimeout(() => {
      setStep('success');
    }, 3000); 
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity flex items-center justify-center p-4"
        onClick={step === 'processing' ? undefined : onClose} // Prevent closing while processing
      >
        {/* Modal Container */}
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
        >
          
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">
              {step === 'success' ? 'Booking Confirmed!' : 'Confirm Booking'}
            </h3>
            {/* Hide close button if we are processing */}
            {step !== 'processing' && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>

          <div className="p-6">
            {/* STEP 1: RIDE DETAILS & FORM */}
            {step === 'details' && (
              <form onSubmit={handlePayment}>
                {/* Ride Summary */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-blue-800 uppercase">Shuttle {ride.vehiclePlate}</span>
                    <span className="text-sm font-bold text-blue-900">{ride.departureTime}</span>
                  </div>
                  <p className="text-sm text-blue-700">Captain: {ride.driverName}</p>
                  <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Fare</span>
                    <span className="text-xl font-black text-gray-900">KSh {ride.price}</span>
                  </div>
                </div>

                {/* M-Pesa Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
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
                  <p className="text-xs text-gray-500 mt-2">
                    You will receive an STK prompt on your phone to enter your PIN.
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center gap-2 shadow-md"
                >
                  Pay KSh {ride.price} with M-Pesa
                </button>
              </form>
            )}

            {/* STEP 2: PROCESSING (STK PUSH SIMULATION) */}
            {step === 'processing' && (
              <div className="text-center py-8">
                {/* Tailwind animated spinner */}
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mb-4"></div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Awaiting Payment</h4>
                <p className="text-gray-500">
                  Please check your phone. Enter your M-Pesa PIN to complete the booking for KSh {ride.price}.
                </p>
              </div>
            )}

            {/* STEP 3: SUCCESS */}
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
                    onClose(); // Close the modal
                    navigate("/tickets"); // <-- Route to tickets page!
                    }}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
  >
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