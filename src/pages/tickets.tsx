import { Link } from "react-router-dom";
import ProfileSidebar from "../components/profileSidebar";
import { useState } from "react";
import { useTickets } from "../context/TicketContext";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Tickets = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { tickets, cancelTicket, isLoadingTickets } = useTickets();
  const { user } = useAuth(); 

const fullUserName = user?.user_metadata?.full_name || "Comrade";
  const displayName = fullUserName.split(' ')[0];
  const initial = displayName.charAt(0).toUpperCase();

  const formatLocation = (loc: string) => {
    const locations: Record<string, string> = {
      town: "CBD", maasai: "Rongai - Maasai Mall", cleanshelf: "Rongai - Cleanshelf", 
      langata: "Langata - T-Mall", karen: "Karen - Galleria", mmu: "Multimedia University", strathmore: "Strathmore University", 
      uon: "UoN Main Campus", cuea: "CUEA", copa: "Cooperative University", ksl: "Kenya School of Law", 
      tangaza: "Tangaza University", africa: "Africa Nazarene University"
    };
    return locations[loc] || loc;
  };

  // Filter the tickets so they go to the right sections
  const activeTickets = tickets.filter(ticket => ticket.status === "Active");
  const pastTickets = tickets.filter(ticket => ticket.status !== "Active");

  //The logic to handle the cancellation click
  const handleCancel = async (ticketId: string) => {
    // Add a standard browser confirmation so they don't click it by accident
    const confirmCancel = window.confirm("Are you sure you want to cancel this ride?");
    if (!confirmCancel) return;

    try {
      await cancelTicket(ticketId);
      alert("Ticket cancelled successfully.");
    } catch (error) {
      alert("Failed to cancel ticket. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="min-h-screen bg-gray-50 flex flex-col w-full"
    >
      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Navigation Bar */}
      <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
          <Link to="/dashboard" state={{ openSidebar: true }} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Dashboard
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold shadow-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
          >
            {initial}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h2>

        {isLoadingTickets ? (
          <div className="flex justify-center items-center py-12">
             <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
          </div>
        ) : (
          <>
            {/* ACTIVE TICKETS SECTION */}
            <section className="mb-12">
              <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                Upcoming Rides
              </h3>
              
              <div className="space-y-4">
                {activeTickets.length === 0 && (
                  <p className="text-gray-500 italic bg-white p-6 rounded-xl border border-gray-100 text-center shadow-sm">
                    No upcoming rides booked.
                  </p>
                )}

                {activeTickets.map(ticket => (
                  <div key={ticket.ticketId} className="bg-white border-2 border-blue-500 rounded-xl p-0 shadow-md overflow-hidden flex flex-col sm:flex-row relative">
                    
                    {/* QR Code Placeholder Area */}
                    <div className="bg-blue-600 text-white p-6 flex flex-col justify-center items-center sm:w-1/3">
                      <div className="bg-white w-24 h-24 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-16 h-16 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v4h-2v-4zm3 3h3v2h-3v-2z"></path></svg>
                      </div>
                      <span className="text-sm font-medium opacity-80">Show to Captain</span>
                    </div>
                    
                    {/* Ticket Details */}
                    <div className="p-6 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-gray-500 font-medium">{ticket.bookingDate} • {ticket.departure_time}</p>
                          <h4 className="text-2xl font-bold text-gray-900">
                            {formatLocation(ticket.origin)} <span className="text-gray-400 mx-1">→</span> {formatLocation(ticket.destination)}
                          </h4>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Seat {ticket.seatNumber}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-100 pt-4 mb-4">
                        <p>Vehicle: <span className="font-bold text-gray-900">{ticket.vehicle_plate}</span></p>
                        <p>Paid: <span className="font-bold text-gray-900">KSh {ticket.price}</span></p>
                      </div>

                      {/* 4. The Cancel Button */}
                      <div className="flex justify-end border-t border-gray-50 pt-2">
                        <button 
                          onClick={() => handleCancel(ticket.ticketId)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-transparent hover:border-red-100"
                        >
                          Cancel Ride
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PAST & CANCELLED TICKETS SECTION */}
            <section>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Ride History</h3>
              <div className="space-y-4">
                {pastTickets.length === 0 && (
                  <p className="text-gray-500 italic">No past rides yet.</p>
                )}
                
                {pastTickets.map(ticket => (
                  <div key={ticket.ticketId} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-75 grayscale-[0.3]">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {formatLocation(ticket.origin)} to {formatLocation(ticket.destination)}
                      </h4>
                      <p className="text-sm text-gray-500">{ticket.bookingDate} • {ticket.departure_time} • Vehicle: {ticket.vehicle_plate}</p>
                    </div>
                    {/* Dynamic styling based on status */}
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      ticket.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

      </main>
    </motion.div>
  );
};

export default Tickets;