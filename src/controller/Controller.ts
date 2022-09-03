import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { rs } from "../service/response.service";
import { Controller } from "./types";

export const testRoute: Controller = (req, res) => {
  rs(req, res)("OK", {
    method: req.method,
    url: req.originalUrl,
  });
};

export const notFound: Controller = (req, res) => {
  rs(req, res)("RouteNotFound");
};

export const apiErrorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  rs(req, res)("ERR", undefined, err as unknown as Error);
};
