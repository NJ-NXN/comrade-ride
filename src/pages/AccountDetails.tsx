import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useAlert } from "../context/AlertContext";

const AccountDetails = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);// State for Edit Mode
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");// State for Form Values
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const { showAlert } = useAlert();

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

      showAlert({
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
        type: "success"
      });
      setIsEditing(false); // Turn off edit mode

      await refreshUser(); // Refresh the user data in the context after update

    } catch (error: any) {
      showAlert({
        title: "Update Failed",
        message: error.message || "Failed to update profile.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long!");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Verify current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: displayEmail,
        password: currentPassword,
      });

      if (verifyError) {
        throw new Error("Incorrect current password.");
      }

      // if it matches, update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setPasswordMessage("Password updated successfully!");
      setCurrentPassword(""); // Clear the current password field
      setNewPassword("");
      setConfirmNewPassword("");
      
      setTimeout(() => setPasswordMessage(""), 3000);

    } catch (error: any) {
      setPasswordError(error.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
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
      
      showAlert({
        title: "Account Deleted",
        message: "Your account has been permanently deleted.",
        type: "success"
      });
      navigate("/login");
      
    } catch (error: any) {
      showAlert({
        title: "Deletion Failed",
        message: "Failed to delete account. Please try again.",
        type: "error"
      });
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
        
        {/* Security Section */}
        <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-12 pt-8 border-t border-gray-100 max-w-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Security</h3>
                  
                  <form onSubmit={handleChangePassword} className="space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Change Password</h4>
                    
                    {/* Current Password Field */}
                    <div className="relative mb-4">
                      <input 
                        type={showCurrentPassword ? "text" : "password"} 
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors bg-white text-gray-900" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {showCurrentPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>

                    {/* Password Grid */}
                    <div className="space-y-6 max-w-2xl">
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors bg-white text-gray-900" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {showNewPassword ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <input 
                          type={showConfirmNewPassword ? "text" : "password"} 
                          placeholder="Confirm New Password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors bg-white text-gray-900" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {showConfirmNewPassword ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {passwordError && (
                      <p className="text-red-500 text-sm font-medium">{passwordError}</p>
                    )}
                    {passwordMessage && (
                      <p className="text-green-600 text-sm font-medium">{passwordMessage}</p>
                    )}

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit"
                        disabled={isUpdatingPassword || !newPassword || !currentPassword}
                        className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                      >
                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>  
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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