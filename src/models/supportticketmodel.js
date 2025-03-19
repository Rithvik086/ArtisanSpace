import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ticketPath = path.join(__dirname,"../../tickets.json");

async function ensureFileExists(filePath) {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, "[]");
    }
  }

  async function readData(filePath) {
    await ensureFileExists(filePath);
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  }
  
  async function writeData(data, filePath) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }


export async function addTicket(fullname,email,pno,role,subject,category,desc){

    const tickets = await readData(ticketPath);
    const newTicket = {
        ticketId: crypto.randomUUID(),
        fullname,
        email,
        pno,
        role,
        subject,
        category,
        desc,
        createdAt: new Date().toISOString()

    };

    tickets.push(newTicket);
    await writeData(tickets,ticketPath);
    // console.log("ticket added");
    return {success: true, ticket : newTicket};

  }

  export async function getTickets() {
    return await readData(ticketPath)
    
  }

  export async function removeTicket(ticketId) {
    let tickets = await readData(ticketPath);
    const initialLength = tickets.length;

    tickets = tickets.filter(ticket => ticket.ticketId !== ticketId);

    if (tickets.length === initialLength) {
        return { success: false, message: "Ticket not found" };
    }

    await writeData(tickets, ticketPath);
    return { success: true, message: "Ticket removed successfully" };
}
