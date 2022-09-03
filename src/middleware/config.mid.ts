import { getRequestSize } from "../service/common.service";
import { stageLoger } from "../service/logger.service";
import { Middleware } from "./types";

export const config: Middleware = async (req, _res, next) => {
  stageLoger({
    execStart: Date.now(),
    reqSize: getRequestSize(req),
  });
  next();
};
