import { Router } from "express";
import {
  create,
  distroy,
  findById,
  findUser,
  logIn,
  logOut,
  update,
} from "../controller/User";
import { testRoute } from "../controller/Controller";
import { authAPIAccess } from "../middleware/authApi.mid";

const apiv1: Router = require("express").Router();

// user handler route
apiv1.route("/auth/user").get(logIn).delete(logOut);
apiv1
  .route("/user")
  .get(authAPIAccess, findUser)
  .post(create)
  .put(authAPIAccess, update)
  .delete(authAPIAccess, distroy);
apiv1.get("/user/:id", authAPIAccess, findById);

// test route
apiv1.route("/test").all(testRoute);

export default apiv1;
