import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useAlert } from "./AlertContext";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// Set inactivity timeout to 15 minutes (in milliseconds)
// 15 mins * 60 seconds * 1000 ms
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    //Check if there's an active session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Real-time Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // INACTIVITY TRACKER
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleInactivityLogout = async () => {
      // Check if they are actually logged in before trying to log them out
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        showAlert({ title: "Logged Out", message: "You have been logged out due to inactivity." });
        await supabase.auth.signOut();
      }
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Set a new countdown timer
      timeoutId = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT);
    };

    // The events that prove the user is still actively using the app
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    // Start listening to the events
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Start the initial countdown
    resetTimer();

    // Cleanup function when the app closes
    return () => {
      subscription.unsubscribe();
      
      // Stop listening to events and clear the timer to prevent memory leaks
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);