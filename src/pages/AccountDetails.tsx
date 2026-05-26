import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const AccountDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for Form Values
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Populate the form with existing data when the component loads
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setPhone(user.user_metadata?.phone || "");
    }
  }, [user]);

  // Handle Saving the Profile
  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // 1. Update the secure auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName, phone: phone }
      });
      if (authError) throw authError;

      // 2. Update the profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone: phone })
        .eq("id", user.id);
      if (profileError) throw profileError;

      alert("Profile updated successfully!");
      setIsEditing(false); // Turn off edit mode

      // Force a page refresh to update the sidebar and header instantly
      window.location.reload(); 

    } catch (error: any) {
      alert(error.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "DANGER: Are you absolutely sure you want to delete your account? This will permanently erase your tickets and profile. This cannot be undone."
    );
    
    if (!confirmDelete) return;
    
    setIsLoading(true);
    try {
      // Call the custom Postgres function to delete the user's account and all associated data
      const { error } = await supabase.rpc("delete_my_account");
      if (error) throw error;

      // Sign the user out of the app locally
      await supabase.auth.signOut();
      
      alert("Your account has been permanently deleted.");
      navigate("/login");
      
    } catch (error: any) {
      alert("Failed to delete account. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // UI calculations for the avatar
  const displayEmail = user?.email || "";
  const fallbackName = displayEmail.split('@')[0] || "Comrade";
  const displayFullName = user?.user_metadata?.full_name || fallbackName;
  const initial = displayFullName.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="min-h-screen bg-gray-50 flex flex-col w-full"
    >
      <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
          <Link to="/dashboard" state={{ openSidebar: true }} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Account Details</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold shrink-0">
                {initial}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-900 truncate">{displayFullName}</h2>
                <p className="text-gray-500 truncate text-sm">{displayEmail}</p>
              </div>
            </div>

            {/* Edit / Save Buttons */}
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* Form Fields Section */}
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors ${
                  isEditing ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900" : "bg-gray-50 border-gray-200 text-gray-500"
                }`} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                disabled 
                value={displayEmail} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" 
              />
              <p className="text-xs text-gray-400 mt-1">Email addresses cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
              <input 
                type="tel" 
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0712 345 678"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors ${
                  isEditing ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900" : "bg-gray-50 border-gray-200 text-gray-500"
                }`} 
              />
            </div>
          </div>
          
          {/* Delete Zone */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete Account</h3>
            <p className="text-sm text-gray-500 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button 
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50"
            >
              Delete My Account
            </button>
          </div>

        </div>
      </main>
    </motion.div>
  );
};

export default AccountDetails;