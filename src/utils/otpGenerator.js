let otpDb = [];

export async function generateOtp(randomId, userId) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = Date.now() + 300 * 1000; // 5 minutes
  otpDb.push({ otp, randomId, userId, expiry });
  return otp;
}

export async function verifyOtp(randomId, otp) {
  const otpEntry = otpDb.find(
    (entry) => entry.randomId === randomId && entry.otp === otp
  );

  if (!otpEntry) {
    return false;
  }

  const isExpired = Date.now() > otpEntry.expiry;

  if (isExpired) {
    otpDb = otpDb.filter((entry) => entry.randomId !== randomId);
    return false;
  }
  return true;
}

export async function verifyOtpExistence(randomId) {
  const otpEntry = otpDb.find((entry) => entry.randomId === randomId);
  otpDb = otpDb.filter((entry) => entry.randomId !== randomId);
  if (otpEntry) {
    return otpEntry.userId;
  } else {
    return false;
  }
}
