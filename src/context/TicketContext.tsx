import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Ride } from "../components/ridecard";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface Ticket extends Ride {
  route: ReactNode;
  ticketId: string;
  bookingDate: string;
  seatNumber: string;
  pickupLocation: string;
  destination: string;   
  status: "Active" | "Completed"| "Cancelled";
}

interface BookingDetails {
  rideId: string;
  seatNumber: string;
  pickupLocation: string;
  destination: string;
}

interface TicketContextType {
  tickets: Ticket[];
  bookTicket: (details: BookingDetails) => Promise<void>;
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
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          id,
          seat_number,
          pickup_location,
          destination,
          status,
          rides (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedTickets: Ticket[] = data.map((item: any) => ({
        ...item.rides, 
        ticketId: item.id,
        seatNumber: item.seat_number,
        pickupLocation: item.pickup_location,
        destination: item.destination,
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

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const bookTicket = async ({ rideId, seatNumber, pickupLocation, destination }: BookingDetails) => {
    if (!user) {
      throw new Error("You must be logged in to book a ride.");
    }

    try {
      const { error } = await supabase.rpc('book_ticket', {
        p_ride_id: rideId,
        p_seat_number: seatNumber,
        p_pickup_location: pickupLocation,
        p_destination: destination
      });

      if (error) {
        if (error.message.includes("Overbooking prevented")) {
          throw new Error("Sorry, someone just booked the last seat!");
        }
        if (error.message.includes("is already booked")) {
          throw new Error(`Sorry, seat ${seatNumber} was just taken by someone else!`);
        }
        throw error;
      }

      await fetchTickets();

    } catch (error: any) {
      console.error("Error booking ticket:", error);
      throw error; 
    }
  };

  const cancelTicket = async (ticketId: string) => {
    if (!user) {
      throw new Error("You must be logged in to cancel a ticket.");
    }

    try {
      const { error } = await supabase
        .from('tickets')
        .delete() 
        .eq('id', ticketId)
        .eq('user_id', user.id);

      if (error) throw error;
      setTickets((prev) => prev.filter((ticket) => ticket.ticketId !== ticketId));
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