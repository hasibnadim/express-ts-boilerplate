import cookieParser from "cookie-parser";
import { Application } from "express";
import cors from "cors";
import { config } from "./middleware/config.mid";
import api from "./routes/api.routes";
import web from "./routes/web.routes";
import { env } from "./service/common.service";

const http = require("http");
const express = require("express");

const app: Application = express();
const server = http.createServer(app);

app.use(cookieParser(), express.json({ limit: "1024kb" }), config);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/", express.urlencoded({ extended: true }), web);

app.use("/api", cors(), api);

app.all("*", (_, res) => res.redirect("/"));

server.listen(env("PORT", 3000), () =>
  console.log(`   Worker ${process.pid} started.`)
);
