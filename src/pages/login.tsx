import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAlert } from "../context/AlertContext";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    let loginEmail = emailOrPhone.trim();

    try {
     // 1. Is this a phone number? (Simple check: no '@' symbol)
      if (!loginEmail.includes("@")) {
        // Look up the phone number in our new profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("email")
          .eq("phone", loginEmail)
          .maybeSingle(); // maybeSingle prevents a crash if it finds 0 matches

        if (profileError || !profile) {
          setError("No account found with this phone number. Please check your number or try your email.");
          setIsLoading(false);
          return;
        }

        // Found the phone number! Swap our variable to the real email address
        loginEmail = profile.email;
      }

      // 2. Now log in securely using the email!
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        // Rate Limit Check
        // Catch the 429 error before it shows a generic failure message
        if (error.message.toLowerCase().includes("too many requests") || error.status === 429) {
          showAlert({
            title: "Account Temporarily Locked",
            message: "We have paused login attempts. Please wait 15 minutes before trying again.",
            type: "danger"
          });
          return;
        }

        // error handling for wrong password/email
        showAlert({
          title: "Login Failed",
          message: error.message || "Invalid email or password.",
          type: "error"
        });
        return;
      }
      navigate("/dashboard"); // Take them to the app!

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;
      
    } catch (error: any) {
      showAlert({ 
        title: "Google Sign-In Failed", 
        message: error.message || "Failed to authenticate with Google. Please try again.", 
        type: "error" 
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      
      {/* LEFT SIDE: The Login Form */}
        <div className="w-full md:w-5/12 lg:w-1/3 flex items-center justify-center bg-white p-8 lg:p-12">
        
            <div className="w-full max-w-sm">
          
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Comrade</h2>
                    <p className="text-gray-500 mt-2">Enter your details to access your account</p>
                </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            {/* Error Message Display */}
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
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-gray-200 w-full"></div>
            <span className="text-gray-500 text-sm font-medium">or</span>
            <div className="h-px bg-gray-200 w-full"></div>
          </div>

          {/* Google Login Button */}
          <button 
            type="button" 
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
          
        </div>
      </div>

      {/* RIGHT SIDE: The Image Banner */}
      {/* Changed width to 7/12 on tablets, and 2/3 (67%) on desktop */}
      <div className="hidden md:flex md:w-7/12 lg:w-2/3 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/hero-shuttle.jpg')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 right-0 p-12 lg:p-16 text-white z-10">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Your Campus Ride,<br /> Sorted.
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-lg">
            Join thousands of comrades skipping the matatu queues. Guaranteed seats, fixed fares, and reliable departures.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;