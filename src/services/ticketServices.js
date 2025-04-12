import Ticket from "../models/supportticketmodel.js";

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

//FIXME: provedes different form of data than sql
export async function getTickets() {
  try {
    const tickets = await Ticket.find().populate(
      "userId",
      "username name email mobile_no role"
    );
    return tickets;
  } catch (e) {
    throw new Error("Error fetching tickets: " + e.message);
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
