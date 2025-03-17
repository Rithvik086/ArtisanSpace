import { addUser, findUserByName } from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/emailService.js";

const signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  username = username.toLowerCase();
  email = email.toLowerCase();
  role = role.toLowerCase();

  const hashpass = await bcrypt.hash(password, 9);

  // const newUser = new User({ username, email, password: hashpass, role });
  // await newUser.save();
  try {
    await addUser(username, email, hashpass, role);
    await sendMail(
      email,
      "Successfully Registered",
      "You have successfully registered to ArtisanSpace. <3"
    );
    res.redirect("/login");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  // const user = await User.findOne({ username });
  const user = await findUserByName(username);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const ismatched = await bcrypt.compare(password, user.password);

  if (!ismatched) {
    return res.status(400).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.cookie("token", token, {
    //modify to use https while in production during deployment
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 86400000,
  });

  // res.status(200).json({ message: "Login successful" });
  res.redirect(`/${user.role}`);
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
  });

  res.redirect("/");
};

export { signup, login, logout };
