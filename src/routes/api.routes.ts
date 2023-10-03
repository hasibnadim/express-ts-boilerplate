import { Router } from "express";
import { responseHandler, notFound } from "../controller/Controller";
import apiv1 from "./api.v1.routes";
import { throttle } from "src/config/throttle";
const api: Router = require("express").Router();

// Apply the rate limiting middleware to all requests
api.use(throttle);

api.use("/v1", apiv1);

// Not Found Path
api.all("*", notFound);

// Response Handle
api.use(responseHandler);

export default api;
