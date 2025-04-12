import mongoose from "mongoose";
import User from "../models/usermodel.js";

export async function userExists(userId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return false;
    }
    const user = await User.findById(userId);
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw new Error("Error checking user existence: " + e.message);
  }
}

export async function addUser(
  username,
  name,
  email,
  hashpass,
  mobile_no,
  role
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).session(session);

    if (existingUser) {
      throw new Error("Username or email already exists.");
    }

    const user = new User({
      username,
      name,
      email,
      password: hashpass,
      mobile_no,
      role,
    });
    await user.save({ session });
    await session.commitTransaction();
    return { success: true };
  } catch (e) {
    await session.abortTransaction();
    if (e.code === 11000) {
      throw new Error("Username or email already exists.");
    }
    throw new Error("Error adding user: " + e.message);
  } finally {
    session.endSession();
  }
}

export async function findUserByName(username) {
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return null;
    }

    return user;
  } catch (e) {
    throw new Error("Error finding user by name: " + e.message);
  }
}

export async function getUserById(userId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    const user = await User.findById(userId);

    return user;
  } catch (e) {
    throw new Error("Error finding user by ID: " + e.message);
  }
}

export async function getUsers() {
  try {
    return await User.find();
  } catch (e) {
    throw new Error("Error getting users: " + e.message);
  }
}

export async function removeUser(userId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user) {
      await User.deleteOne({ _id: userId }, { session });
      await session.commitTransaction();
      return { success: true };
    } else {
      throw new Error("User not found.");
    }
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error removing user: " + e.message);
  } finally {
    session.endSession();
  }
}

export async function updateUser(userId, name, mobile_no, address) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID.");
    }
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (mobile_no !== undefined) updateFields.mobile_no = mobile_no;
    if (address !== undefined) updateFields.address = address;

    console.log(updateFields);

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
      session,
    });

    if (!updatedUser) {
      throw new Error("User not found.");
    } else {
      await session.commitTransaction();
      return { success: true, data: updatedUser };
    }
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error updating user: " + e.message);
  } finally {
    session.endSession();
  }
}
