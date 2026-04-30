import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TicketProvider } from "./context/TicketContext";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Tickets from "./pages/tickets";
import AccountDetails from "./pages/AccountDetails";
import PaymentMethods from "./pages/PaymentMethods";

function App() {
  return (
    <TicketProvider>
    <BrowserRouter>
      <Routes>
        {/* We will redirect the home page directly to the login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/tickets" element={<Tickets />}/>
        <Route path="/account" element={<AccountDetails />}/>
        <Route path="/payment-methods" element={<PaymentMethods />}/>
      </Routes>
    </BrowserRouter>
    </TicketProvider>
  );
}

export default App;