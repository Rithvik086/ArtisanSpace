let otpDb = [];

export async function generateOtp(randomId1, randomId2, userId) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = Date.now() + 300 * 1000; // 5 minutes
  otpDb.push({ otp, randomId1, randomId2, userId, expiry });
  return otp;
}

export async function verifyOtp(randomId, otp) {
  const otpEntry = otpDb.find(
    (entry) => entry.randomId1 === randomId && entry.otp === otp
  );

  if (!otpEntry) {
    return false;
  }

  const isExpired = Date.now() > otpEntry.expiry;

  if (isExpired) {
    otpDb = otpDb.filter((entry) => entry.randomId1 !== randomId);
    return false;
  }
  return otpEntry.randomId2;
}

export async function verifyOtpExistence(randomId) {
  const otpEntry = otpDb.find((entry) => entry.randomId2 === randomId);
  otpDb = otpDb.filter((entry) => entry.randomId2 !== randomId);
  if (otpEntry) {
    return otpEntry.userId;
  } else {
    return false;
  }
}
