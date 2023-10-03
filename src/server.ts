import cookieParser from "cookie-parser";
import { Application } from "express";
import cors from "cors";
import api from "./routes/api.routes";
import web from "./routes/web.routes";
import { env } from "./utils/func.utils";

const http = require("http");
const express = require("express");

const app: Application = express();
const server = http.createServer(app);

app.use(cookieParser(), express.json({ limit: "1024kb" }));

app.set("view engine", "pug");
app.use(express.static("public"));

app.use("/", express.urlencoded({ extended: true }), web);

app.use("/api", cors(), api);

app.all("*", (_, res) => res.redirect("/"));

server.listen(env("PORT", 3000), () =>
  console.log("\x1b[32m", `  Worker ${process.pid} started.`, "\x1b[0m")
);
