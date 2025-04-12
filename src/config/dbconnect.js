import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connection established`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default dbConnect;
