import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { TicketProvider } from "./context/TicketContext";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Tickets from "./pages/tickets";
import AccountDetails from "./pages/AccountDetails";
import PaymentMethods from "./pages/PaymentMethods";

// 1. Create a sub-component to handle the animated routing
const AnimatedRoutes = () => {
  const location = useLocation(); // Tracks which page we are currently on

  return (
    // mode="wait" ensures the current page slides out BEFORE the new one loads in
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/account" element={<AccountDetails />} />
        <Route path="/payments" element={<PaymentMethods />} />
      </Routes>
    </AnimatePresence>
  );
};

// 2. The main App component
function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TicketProvider>
    </AuthProvider>
  );
}

export default App;