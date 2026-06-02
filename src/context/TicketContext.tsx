import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Ride } from "../components/ridecard";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

// Define what a Ticket looks like (Ride data + Ticket specifics)
export interface Ticket extends Ride {
  route: ReactNode;
  ticketId: string;
  bookingDate: string;
  seatNumber: string;
  status: "Active" | "Completed"| "Cancelled";
}

interface TicketContextType {
  tickets: Ticket[];
  bookTicket: (ride: Ride, date: string) => Promise<void>;
  cancelTicket: (ticketId: string) => Promise<void>;
  isLoadingTickets: boolean;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const { user } = useAuth(); 

  const fetchTickets = async () => {
    if (!user) {
      setTickets([]);
      setIsLoadingTickets(false);
      return;
    }

    setIsLoadingTickets(true);
    try {
      // Fetch the tickets and join the ride data at once
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          id,
          seat_number,
          status,
          rides (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the database response so it perfectly matches what UI expects
      const formattedTickets: Ticket[] = data.map((item: any) => ({
        ...item.rides, 
        ticketId: item.id,
        seatNumber: item.seat_number,
        status: item.status,
        bookingDate: item.rides.departure_date,
      }));

      setTickets(formattedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  // Automatically fetch tickets when the app loads or when the user changes
    useEffect(() => {
    fetchTickets();
  }, [user]);

  // function to save a new ticket to the cloud
  const bookTicket = async (ride: Ride, _date: string) => {
    if (!user) return;

    const randomSeat = Math.floor(Math.random() * 14 + 1).toString();

    try {
      const { error } = await supabase
        .from("tickets")
        .insert({
          user_id: user.id,
          ride_id: ride.id,
          seat_number: randomSeat,
          status: "Active"
        });

      if (error) throw error;

      // Re-fetch tickets so the newly booked ride shows up instantly
      await fetchTickets();

    } catch (error) {
      console.error("Error booking ticket:", error);
      throw error; // Let the modal know it failed
    }
  };

  const cancelTicket = async (ticketId: string) => {
    if (!user) {
      throw new Error("You must be logged in to cancel a ticket.");
    }

    try {
      const { error } = await supabase
        .from('tickets')
        // Assuming cancellation logic is either a delete() or an update({ status: 'cancelled' })
        .delete() // or .update({ status: 'cancelled' })
        .eq('id', ticketId)
        .eq('user_id', user.id);

      if (error) throw error;
        // Update local React state to remove the cancelled ticket
        setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      // Refresh the tickets list to instantly update the UI!
    } catch (error: any) {
      console.error("Error cancelling ticket:", error);
      throw error;
    }
  };

  return (
    <TicketContext.Provider value={{ tickets, bookTicket, cancelTicket, isLoadingTickets }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error("useTickets must be used within TicketProvider");
  return context;
};