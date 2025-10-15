import Ticket from "../models/supportticketmodel.js";
import User from "../models/usermodel.js";

export async function addTicket(userId, subject, category, description) {
  try {
    const ticket = new Ticket({
      userId,
      subject,
      category,
      description,
    });
    await ticket.save();
    return { success: true };
  } catch (e) {
    throw new Error("Error adding ticket: " + e.message);
  }
}

// Correctly named and exported
export async function getTickets() {
  try {
    const tickets = await Ticket.find({}).lean();

    const populatedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const user = await User.findById(ticket.userId)
          .select("username name email role")
          .lean();

        if (user) {
          return { ...ticket, userId: user };
        }

        return {
          ...ticket,
          userId: {
            username: "Deleted User",
            name: "N/A",
            email: "N/A",
            role: "N/A",
          },
        };
      })
    );

    return populatedTickets;
  } catch (e) {
    console.error("Error fetching tickets in service:", e.message);
    return [];
  }
}

export async function removeTicket(ticketId) {
  try {
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return { success: true };
  } catch (e) {
    throw new Error("Error deleting ticket: " + e.message);
  }
}

export async function updateTicketStatus(ticketId, status) {
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.status = status;
    await ticket.save();
    return { success: true };
  } catch (e) {
    throw new Error("Error updating ticket status: " + e.message);
  }
}
