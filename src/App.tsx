import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Tickets from "./pages/tickets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* We will redirect the home page directly to the login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/tickets" element={<Tickets />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;