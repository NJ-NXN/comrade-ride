import { Link } from "react-router-dom";
import ProfileSidebar from "../components/profileSidebar";
import { useState } from "react";

// Mock data for tickets
const ACTIVE_TICKETS = [
  { id: "t1", route: "Rongai to MMU", date: "Today", time: "07:30 AM", vehicle: "KDG 456K", seat: "4", status: "Active", fare: 50 }
];

const PAST_TICKETS = [
  { id: "t2", route: "Langata to Strathmore", date: "12 Apr 2026", time: "08:00 AM", vehicle: "KCX 123J", seat: "11", status: "Completed", fare: 60 },
  { id: "t3", route: "Karen to UoN-Main Campus", date: "05 Apr 2026", time: "06:30 AM", vehicle: "KDL 789M", seat: "2", status: "Completed", fare: 100 }
];

const Tickets = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Navigation Bar */}
      <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
          <Link to="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
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
            {ACTIVE_TICKETS.map(ticket => (
              <div key={ticket.id} className="bg-white border-2 border-blue-500 rounded-xl p-0 shadow-md overflow-hidden flex flex-col sm:flex-row">
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
                      <p className="text-sm text-gray-500 font-medium">{ticket.date} • {ticket.time}</p>
                      <h4 className="text-2xl font-bold text-gray-900">{ticket.route}</h4>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Seat {ticket.seat}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <p>Vehicle: <span className="font-bold text-gray-900">{ticket.vehicle}</span></p>
                    <p>Paid: <span className="font-bold text-gray-900">KSh {ticket.fare}</span></p>
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
    </div>
  );
};

export default Tickets;