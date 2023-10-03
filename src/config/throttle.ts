import rateLimit from "express-rate-limit";

export const throttle = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: async (req, resp) => {
      return 100;
    }, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: async (req: Request) => {
      return "Too many request from this IP, please try again after an hour";
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });