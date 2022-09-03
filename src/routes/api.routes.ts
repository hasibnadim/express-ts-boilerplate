import { Router } from "express";
import { apiErrorHandler, notFound } from "../controller/Controller";
import { limiter } from "../service/apiReqRateLimiter.service";
import apiv1 from "./api.v1.routes";

const api: Router = require("express").Router();

// Apply the rate limiting middleware to all requests
api.use(limiter());

api.use("/v1", apiv1);

// Not Found Path
api.all("*", notFound);

// Error Handle
api.use(apiErrorHandler);

export default api;
