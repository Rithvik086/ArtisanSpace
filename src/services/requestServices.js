import Request from "../models/customRequestModel.js";
//FIXME: Complete service data output is different and need work on that

export async function addRequest(
  userId,
  title,
  type,
  image,
  description,
  budget,
  requiredBy,
) {
  try {
    const request = new Request({
      userId,
      title,
      type,
      image,
      description,
      budget,
      requiredBy,
    });
    await request.save();
    return { success: true };
  } catch (error) {
    throw new Error("Error adding request: " + error.message);
  }
}

export async function getRequestById(userId) {
  try{
    const request = await Request.find({ userId })
    if (!request) {
      throw new Error("Request not found!");
    }
   
    return request;

  }catch(err){
    throw new Error("Error in getting request by ID: " + err.message);
  }
}

export async function getRequests(isAccepted = null, artisanId = null) {
  try {
    let query = Request.find().populate("userId");

    if (artisanId) {
      query = query.where({ artisanId, isAccepted: true });
    } else if (isAccepted !== null) {
      query = query.where({ isAccepted });
    }

    const request = await query.exec();
    return request;
  } catch (e) {
    throw new Error("Error in getting requests: " + e.message);
  }
}

export async function deleteRequest(requestId) {
  try {
    const request = await Request.findByIdAndDelete(requestId);
    if (!request) {
      throw new Error("Error request not found!");
    }
    return { success: true, message: "Request removed successfully!" };
  } catch (error) {
    throw new Error("Error in deleting the request: " + error.message);
  }
}

export async function approveRequest(requestId, artisanId) {
  try {
    const request = await Request.findByIdAndUpdate(
      requestId,
      { artisanId, isAccepted: true },
      { new: true, runValidators: true },
    );

    if (!request) {
      throw new Error("Request not found!");
    }

    return { success: true, message: "Request approved successfully!" };
  } catch (error) {
    throw new Error("Error in approving the request: " + error.message);
  }
}
