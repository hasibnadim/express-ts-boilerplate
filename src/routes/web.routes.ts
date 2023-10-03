import { Router } from "express";
import { ViewLogin } from "./../controller/auth";

const web: Router = Router();

// get:login_page, post:create_session
web.route("/auth").get(ViewLogin)//.post(Login);

export default web;
