import { createContext, useContext, useState, type ReactNode } from "react";
import { type Ride } from "../components/ridecard";

// Define what a Ticket looks like (Ride data + Ticket specifics)
export interface Ticket extends Ride {
  ticketId: string;
  bookingDate: string;
  seatNumber: string;
  status: "Active" | "Completed";
}

// Define the vault functions
interface TicketContextType {
  tickets: Ticket[];
  bookTicket: (ride: Ride, date: string) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Function to create a new ticket and save it to the vault
  const bookTicket = (ride: Ride, date: string) => {
    const newTicket: Ticket = {
      ...ride,
      ticketId: `TICK-${Math.floor(Math.random() * 10000)}`, // Random ID generator
      bookingDate: date,
      seatNumber: Math.floor(Math.random() * 14 + 1).toString(), // Random seat 1-14
      status: "Active",
    };
    setTickets((prev) => [...prev, newTicket]);
  };

  return (
    <TicketContext.Provider value={{ tickets, bookTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

// Custom Hook to easily access the vault from any component
export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error("useTickets must be used within TicketProvider");
  return context;
};