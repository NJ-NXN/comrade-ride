import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAlert } from "../context/AlertContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        // Rate Limit check
        if (error.message.toLowerCase().includes("too many requests") || error.status === 429) {
          showAlert({
            title: "Too Many Requests",
            message: "We have paused password reset attempts. Please wait a few minutes before requesting another link.",
            type: "danger"
          });
          setIsLoading(false);
          return;
        }
        throw error;
      }

      // If successful!
      setMessage("If an account exists for this email, we have sent a password reset link.");
      showAlert({
        title: "Link Sent",
        message: "Please check your inbox (and spam folder) for the password reset link.",
        type: "success"
      });
      
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
        </div>

        {message ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 font-medium">
              {message}
            </div>
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="student@uni.ac.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-3 rounded-lg transition-colors shadow-md ${
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>

            <p className="mt-6 text-center text-sm text-gray-600">
              Remembered your password?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;