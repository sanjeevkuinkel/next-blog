import { randomBytes } from "crypto";
const getRandomString = (strLength) => {
  const randomString = randomBytes(strLength).toString("hex");
};
getRandomString(50);
