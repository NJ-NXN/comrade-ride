// src/pages/Signup.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // State to hold password mismatch errors

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state on new submission
    setError("");

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    console.log("Signup submitted:", { emailOrPhone, password });
    // Later: Send to database and trigger the automated welcome email here!
  };

  return (
    <div className="min-h-screen w-full flex">
      
      {/* LEFT SIDE: The Signup Form */}
      <div className="w-full md:w-5/12 lg:w-1/3 flex items-center justify-center bg-white p-8 lg:p-12">
        <div className="w-full max-w-sm">
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
            <p className="text-gray-500 mt-2">Join Comrade Ride Connect today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone Number
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="07... or student@uni.ac.ke"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Type your password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Error Message Display */}
            {error && (
              <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg mt-2"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-gray-200 w-full"></div>
            <span className="text-gray-500 text-sm font-medium">or</span>
            <div className="h-px bg-gray-200 w-full"></div>
          </div>

          {/* Google Signup Button */}
          <button className="mt-8 w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
          
        </div>
      </div>

      {/* RIGHT SIDE: The Image Banner */}
      <div className="hidden md:flex md:w-7/12 lg:w-2/3 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/hero-shuttle.jpg')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 right-0 p-12 lg:p-16 text-white z-10">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Secure Your Seat,<br /> Avoid the Rush.
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-lg">
            Create an account in seconds and start booking your campus rides ahead of time.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Signup;