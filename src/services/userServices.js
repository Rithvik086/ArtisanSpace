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
  role,
) {
  try {
    const existingUser = await User.findOne({
      $OR: [{ username: username }, { email: email }],
    });

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
    await user.save();
    return { success: true };
  } catch (e) {
    if (e.code === 11000) {
      throw new Error("Username or email already exists.");
    }
    throw new Error("Error adding user: " + e.message);
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

export async function findUserById(userId) {
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
  try {
    const user = await User.findById(userId);

    if (user) {
      await user.remove();
      return { success: true };
    } else {
      throw new Error("User not found.");
    }
  } catch (e) {
    throw new Error("Error removing user: " + e.message);
  }
}

export async function updateUser(userId, name, mobile_no, address) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID.");
    }
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (mobile_no !== undefined) updateFields.mobile_no = mobile_no;
    if (address !== undefined) updateFields.address = address;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error("User not found.");
    } else {
      return { success: true, data: updatedUser };
    }
  } catch (e) {
    throw new Error("Error updating user: " + e.message);
  }
}
