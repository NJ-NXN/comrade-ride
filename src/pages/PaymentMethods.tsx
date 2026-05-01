// src/pages/PaymentMethods.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentMethods = () => {
  return (
    // The Framer Motion container to handle the slide-in animation
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="min-h-screen bg-gray-50 flex flex-col w-full"
    >
      
      {/* Navbar */}
      <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
          <Link to="/dashboard" state={{ openSidebar: true }} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Payment Methods</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6">
        
        {/* Linked Accounts Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Linked Accounts</h2>
          
          {/* M-Pesa Card (Active) */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6 flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                {/* M-Pesa Phone Icon */}
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">M-Pesa (Default)</h3>
                <p className="text-sm text-gray-500">+254 712 *** 678</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Active
            </span>
          </div>

          {/* Visa Card (Inactive/Alternative) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                {/* Credit Card Icon */}
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Visa Debit</h3>
                <p className="text-sm text-gray-500">**** **** **** 4242</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Method Button */}
        <button className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all">
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          <span className="font-semibold">Add New Payment Method</span>
        </button>

      </main>
    </motion.div>
  );
};

export default PaymentMethods;