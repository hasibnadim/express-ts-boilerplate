import { Router } from "express";
import { sReport } from "../controller/administrator/ServerReport";
import { Login, Logout, ViewLogin } from "../controller/administrator/Auth";
import { CheckAdminLogin } from "../middleware/administrator/chackAuth.mid";

const web: Router = require("express").Router();

// get:login_page, post:create_session
web.route("/auth").get(ViewLogin).post(Login);

//delete:logout
web.post("/auth/logout", CheckAdminLogin, Logout);

// server report
web.get("/_sr", CheckAdminLogin, sReport);

export default web;
