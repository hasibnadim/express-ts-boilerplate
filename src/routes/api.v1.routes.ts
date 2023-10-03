import { Router } from "express";

import { pong } from "../controller/Controller";

const apiv1: Router = require("express").Router();


// // test route
apiv1.route("/ping").all(pong);

export default apiv1;
