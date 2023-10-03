import { ErrorRequestHandler, RequestHandler } from "express";
import { IErrorResp, buildResponse } from "../lib/response.lib";
import { logger } from "../config/logger.conf";
import { byteConverter, getObjectSize } from "../utils/func.utils";

export const pong: RequestHandler = async (req, _, resfn) => {
  resfn(buildResponse("OK", { message: "pong" }));
};

export const notFound: RequestHandler = (req, _, resfn) => {
  resfn(buildResponse("RouteNotFound"));
};

export const responseHandler: ErrorRequestHandler = (
  err: IErrorResp,
  req,
  res,
  _next
) => {
  
  let responseData = {
    code: err.code,
    message: err.message
      .replace("[METHOD]", req.method)
      .replace("[URL]", req.originalUrl),
    body: err.data,
  };

  // loggin start
  let logData = {
    identifier: 0,
    endpoint: `${req.method}:_${req.path}`,
    status: err.status,
    request: {
      byteSize: byteConverter(
        getObjectSize({ ...req.body, ...req.query, ...req.headers }),
        true
      ),
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
    },
    response: {
      byteSize: byteConverter(getObjectSize(responseData), true),
      data: responseData,
    },
  };
  res.status(err.status).json(responseData);

  if (err.code === "ERR") {
    logger.error(logData);
  } else {
    logger.info(logData);
  }
};
