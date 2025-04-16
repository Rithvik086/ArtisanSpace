import Workshop from "../models/workshopmodel.js";

export async function bookWorkshop(
  userId,
  workshopTitle,
  workshopDescription,
  date,
  time
) {
  try {
    const workshop = new Workshop({
      userId,
      workshopTitle,
      workshopDescription,
      date,
      time,
    });
    await workshop.save();
    return { success: true, message: "Workshop booked successfully!" };
  } catch (e) {
    throw new Error("Error booking workshop: " + e.message);
  }
}

export async function getWorkshops(isAccepted = null) {
  try {
    let query = Workshop.find().populate("userId");
    if (isAccepted === true) {
      query = query.where({ status: true });
    } else if (isAccepted === false) {
      query = query.where({ status: false });
    }
    const workshops = await query.exec();
    return workshops;
  } catch (e) {
    throw new Error("Error getting workshops: " + e.message);
  }
}

export async function getWorkshopById(workshopId) {
  try {
    const workshop = await Workshop.findById(workshopId).populate("userId");
    if (!workshop) {
      throw new Error("Workshop not found");
    }
    return workshop;
  } catch (e) {
    throw new Error("Error getting workshop by ID: " + e.message);
  }
}

export async function acceptWorkshop(workshopId, artisanId) {
  try {
    const workshop = await Workshop.findByIdAndUpdate(
      workshopId,
      { status: true, artisanId, acceptedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!workshop) {
      throw new Error("Workshop not found");
    }
    return { success: true, message: "Workshop accepted successfully!" };
  } catch (e) {
    throw new Error("Error accepting workshop: " + e.message);
  }
}

export async function removeWorkshop(workshopId) {
  try {
    const workshop = await Workshop.findByIdAndDelete(workshopId);
    if (!workshop) {
      throw new Error("Workshop not found");
    }
    return { success: true, message: "Workshop removed successfully!" };
  } catch (e) {
    throw new Error("Error removing workshop: " + e.message);
  }
}

export async function getAvailableWorkshops() {
  try {
    const workshops = await Workshop.find({ status: 0 }).populate("userId");
    return workshops;
  } catch (e) {
    throw new Error("Error getting available workshops: " + e.message);
  }
}

export async function getAcceptedWorkshops(artisanId = null) {
  try {
    let query = Workshop.find({ status: 1 }).populate("userId");
    if (artisanId) {
      query = query.where({ artisanId });
    }
    const workshops = await query.exec();
    return workshops;
  } catch (e) {
    throw new Error("Error getting accepted workshops: " + e.message);
  }
}

export async function getWorkshopByUserId(userId) {
  try {
    const workshops = await Workshop.find({ userId })
    if (!workshops) {
      throw new Error("Workshops not found");
    }
   

    return workshops;
  } catch (e) {
    throw new Error("Error getting workshop by user ID: " + e.message);
  }
}
