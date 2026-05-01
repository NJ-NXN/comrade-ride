import { Link } from "react-router-dom";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSidebar = ({ isOpen, onClose }: ProfileSidebarProps) => {
  return (
    <>
      {/* THE BACKDROP OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* THE SLIDE-OUT PANEL */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            {/* Close (X) Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* User Info Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-200 text-blue-700 flex items-center justify-center text-2xl font-bold shadow-sm">
              U
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">User</h3>
              <p className="text-sm text-gray-500">user@students.uni.ac.ke</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-2">
          <Link to="/account" onClick={onClose} className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium">
            {/* User Icon */}
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Account Details
          </Link>
          <Link to="/payments" onClick={onClose} className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium">
            {/* Card Icon */}
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            Payment Methods
          </Link>
          <Link to="/tickets" onClick={onClose} className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Ride History
        </Link>
        </div>

        {/* Footer / Logout Button locked to the bottom */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-100 bg-white">
          <Link 
            to="/login"
            className="flex items-center justify-center gap-2 w-full p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Log Out
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;