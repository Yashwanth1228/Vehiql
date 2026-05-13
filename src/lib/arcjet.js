import arcjet, { fixedWindow } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // track requests by IP address
  rules: [
    fixedWindow({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      window: "3600s", // per hour
      max: 10, // allow a maximum of 10 requests
    }),
  ],
});

export default aj;
