import { Link } from "react-router-dom";
import ProfileSidebar from "../components/profileSidebar";
import { useState } from "react";
import { useTickets } from "../context/TicketContext";
import { motion } from "framer-motion";

// Mock data for tickets

const PAST_TICKETS = [
  { id: "t2", route: "Langata to Strathmore", date: "12 Apr 2026", time: "08:00 AM", vehicle: "KCX 123J", seat: "11", status: "Completed", fare: 60 },
  { id: "t3", route: "Karen to UoN-Main Campus", date: "05 Apr 2026", time: "06:30 AM", vehicle: "KDL 789M", seat: "2", status: "Completed", fare: 100 }
];

const Tickets = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { tickets } = useTickets();

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
            Back to Search
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold shadow-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
          >
            U
          </button>
        </div>
      </header>
        
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h2>

        {/* ACTIVE TICKETS SECTION */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Upcoming Rides
          </h3>
          
          <div className="space-y-4">
            {/* 3. Show a message if they have no tickets */}
            {tickets.length === 0 && (
              <p className="text-gray-500 italic">No upcoming rides booked yet.</p>
            )}

            {/* 4. Map over the REAL tickets! */}
            {tickets.map(ticket => (
              <div key={ticket.ticketId} className="bg-white border-2 border-blue-500 rounded-xl p-0 shadow-md overflow-hidden flex flex-col sm:flex-row">
                 
                {/* Ticket Details using the real properties */}
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{ticket.bookingDate} • {ticket.departureTime}</p>
                      <h4 className="text-2xl font-bold text-gray-900">Your Route</h4>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Seat {ticket.seatNumber}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <p>Vehicle: <span className="font-bold text-gray-900">{ticket.vehiclePlate}</span></p>
                    <p>Paid: <span className="font-bold text-gray-900">KSh {ticket.price}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAST TICKETS SECTION */}
        <section>
          <h3 className="text-xl font-bold text-gray-700 mb-4">Past Rides</h3>
          <div className="space-y-4">
            {PAST_TICKETS.map(ticket => (
              <div key={ticket.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-75 grayscale-[0.5]">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{ticket.route}</h4>
                  <p className="text-sm text-gray-500">{ticket.date} • {ticket.time} • Vehicle: {ticket.vehicle}</p>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>
    </motion.div>
  );
};

export default Tickets;