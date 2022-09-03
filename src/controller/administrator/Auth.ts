import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import { env } from "../../service/common.service";
import { Controller } from "../types";
var sha1 = require("sha1");
export const Login: Controller = (req, res) => {
  var { password, unameoremail } = req.body;
  if (password == env("SERVER_ADMIN_PASS")) {
    const filename = sha1(unameoremail);
    const folderDir = join(homeDir, "cache", "session");

    if (!existsSync(folderDir)) mkdirSync(folderDir);

    writeFileSync(
      join(folderDir, filename + ".json"),
      JSON.stringify(
        {
          createdAt: Date.now(),
          client: req.headers,
        },
        null,
        2
      )
    );
    res.cookie("loginToken", filename);
    res.redirect("/_sr");
  } else res.redirect("/auth?message=Invalid Credintial");
};
export const ViewLogin: Controller = (req, res) => {
  res.render("auth/login", {
    title: "Admin Login",
    appname: env("APP_NAME", "ExpressTS Boilerplate"),
    message: req.query?.message,
  });
};
export const Logout: Controller = (req, res) => {
  try {
    const filename = req.cookies?.loginToken;
    unlinkSync(join(homeDir, "cache", "session", filename + ".json"));
    res.clearCookie("loginToken");
  } catch (error) {}

  res.redirect("/");
};
