import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AccountDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-hidden">
      
      {/* STATIC NAVBAR: High z-index keeps it layered ON TOP of the animation */}
      <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200 relative z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
          <Link to="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Account Details</h1>
        </div>
      </header>

      {/* ANIMATED MAIN CONTENT: Slides out from under the navbar! */}
      <motion.main
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 relative z-10"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold">U</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Comrade</h2>
              <p className="text-gray-500">Student ID: STD-84920</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" disabled value="user@students.uni.ac.ke" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="text" disabled value="+254 712 345 678" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default AccountDetails;