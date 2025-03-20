import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workshopspath = path.join(__dirname, "../../workshops.json");

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

export async function bookWorkshop(
  username,
  email,
  pno,
  workshopTitle,
  workshopDesc,
  date,
  scheduletime
) {
  const workshops = await readData(workshopspath);
  const newWorkshop = {
    wid: Date.now().toString(), // Adding a unique ID for easier identification
    username,
    email,
    pno,
    workshopTitle,
    workshopDesc,
    date,
    scheduletime,
    isAccepted: false, // Default value is false (not accepted yet)
    artisanId: null, // Will store the ID of the artisan who accepts the workshop
    acceptedAt: null // Will store the timestamp when the workshop is accepted
  };
  
  workshops.push(newWorkshop);
  await writeData(workshops, workshopspath);
  return { success: true, workshop: newWorkshop };
}

export async function getWorkshops(filter = {}) {
  const workshops = await readData(workshopspath);
  
  // If filter is provided, filter the workshops accordingly
  if (Object.keys(filter).length > 0) {
    return workshops.filter(workshop => {
      for (const [key, value] of Object.entries(filter)) {
        if (workshop[key] !== value) return false;
      }
      return true;
    });
  }
  
  return workshops;
}



export async function acceptWorkshop(workshopId, artisanId) {
  return updateWorkshop(workshopId, {
    isAccepted: true,
    artisanId,
    acceptedAt: new Date().toISOString()
  });
}

export async function removeWorkshop(workshopId) {
  const workshops = await readData(workshopspath);
  const index = workshops.findIndex(workshop => workshop.id === workshopId);
  
  if (index === -1) {
    return { success: false, message: "Workshop not found" };
  }
  
  // Remove the workshop from the array
  const removedWorkshop = workshops.splice(index, 1)[0];
  
  await writeData(workshops, workshopspath);
  return { success: true, workshop: removedWorkshop };
}

// Get available workshops (not yet accepted)
export async function getAvailableWorkshops() {
  return getWorkshops({ isAccepted: false });
}

// Get accepted workshops
export async function getAcceptedWorkshops(artisanId = null) {
  if (artisanId) {
    return getWorkshops({ isAccepted: true, artisanId });
  }
  return getWorkshops({ isAccepted: true });
}