import { readFileSync } from "fs";
import { join } from "path";
import { Middleware } from "../types";
export const CheckAdminLogin: Middleware = (req, res, next) => {
  const fileName = req.cookies?.loginToken;
  if (fileName) {
    try {
      const session = JSON.parse(
        readFileSync(
          join(homeDir, "cache", "session", fileName + ".json")
        ).toString()
      );
      if (parseInt(session.createdAt) + 60000 * 60 * 2 > Date.now()) {
        next();
      } else res.redirect("/auth?message=Session expired! please login again");
    } catch (error) {
      res.redirect("/auth?message=Session restore failed! please login");
    }
  } else {
    res.redirect("/auth?message=Invalid Session! please login");
  }
};
