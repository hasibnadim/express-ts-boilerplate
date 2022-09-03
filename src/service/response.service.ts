import { Request, Response } from "express";
import { ResponseCodes } from "src/utils/iresCode";
import { getResponseCM, getResponseSize } from "./common.service";
import { log } from "./logger.service";

//// response funtion
type ResponseData = (
  req: Request,
  res: Response
) => (
  actionCode?: ResponseCodes["ResultCode"] | ResponseCodes["ErrorCode"],
  data?: any,
  error?: Error
) => void;

export const rs: ResponseData = (req, res) => (actionCode, data, error) => {
  let [code, message, strCode] = getResponseCM(actionCode, req);
  let body = {
    resultCode: strCode,
    message: message,
    data,
  };
  if (!res.headersSent) res.status(code).json(body);

  log({
    urlKey: `${req.method}:${req.baseUrl}${req.route.path}`,
    resultCode: strCode,
    resSize: getResponseSize(body),
    error,
  });
};
