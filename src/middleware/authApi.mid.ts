import { verify } from "jsonwebtoken";
import { prismax } from "../service/database.service";
import { env } from "../service/common.service";
import { Middleware } from "./types";
import { rs } from "../service/response.service";

export const authAPIAccess: Middleware = async (req, _res, next) => {
  // session created at file://./../controller/User.ts#logIn
  const { accessToken } = req.cookies;

  try {
    const isVerified: { sessionID: string; sessionKey: string } = verify(
      accessToken,
      env("JWTSECRET", "$%#@^^^&*&")
    ) as { sessionID: string; sessionKey: string };
    if (isVerified?.sessionID && isVerified?.sessionKey) {
      const user = await prismax.user.findFirst({
        where: {
          sessionID: isVerified?.sessionID,
          sessionKey: isVerified?.sessionKey,
        },
      });
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          password: user.password,
          sessionKey: user.sessionKey,
          sessionID: user.sessionID,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        next();
      } else {
        _res.clearCookie("accessToken");
        rs(req, _res)("InvalidSession");
      }
    } else {
      _res.clearCookie("accessToken");
      rs(req, _res)("InvalidSession");
    }
  } catch (error) {
    _res.clearCookie("accessToken");
    next(error);
  }
};
