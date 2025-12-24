import bcrypt from "bcrypt";

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(EMAIL_REGEX);
};

export const getHashedPassword = async (plainText: string) => {
  const saltRound = 10;
  const hashed = await bcrypt.hash(plainText, saltRound);

  return hashed;
};

export const verifyPasswordHash = async (
  hashedPassword: string,
  plainText: string
) => {
  return await bcrypt.compare(plainText, hashedPassword);
};
