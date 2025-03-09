import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  //console.log('body',username,password,email,role);
  //salt is the team number
  const hashpass = await bcrypt.hash(password, 9);

  const newUser = new User({ username, email, password: hashpass, role });
  await newUser.save();

  res.redirect("/login");
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const ismatched = await bcrypt.compare(password, user.password);

  if (!ismatched) {
    return res.status(400).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
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

export { signup, login };
