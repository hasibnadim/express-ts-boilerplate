//@collapse
import { compareSync, hashSync } from "bcrypt";
import { prismax } from "../service/database.service";
import { rs } from "../service/response.service";
import { sign } from "jsonwebtoken";
import { Controller } from "./types";
import uuid4 from "uuid4";
import sha1 from "sha1";
import { env } from "../service/common.service";

export const logIn: Controller = async (req, res, next) => {
  var { email, password }: any = req.headers;
  if (!email || !password) {
    rs(req, res)("LoginFieldRqueird");
    return;
  }
  try {
    var user = await prismax.user.findFirst({ where: { email } });
    if (compareSync(password, user?.password || "") && user) {
      const sessionKey = uuid4() + "-" + sha1(user.updatedAt.toString()),
        sessionID = sha1(sessionKey + user.id),
        token = sign(
          {
            sessionID,
            sessionKey,
          },
          env("JWTSECRET", "$%#@^^^&*&"),
          { expiresIn: "7d" }
        );
      await prismax.user.update({
        where: {
          id: user.id,
        },
        data: {
          sessionID,
          sessionKey,
        },
      });
      res.cookie("accessToken", token);
      rs(req, res)("LoggedIn", { accessToken: token });
    } else {
      rs(req, res)("NoUserFoundForLogin");
    }
  } catch (error) {
    next(error);
  }
};

export const logOut: Controller = (req, res) => {
  res.clearCookie("accessToken");
  rs(req, res)("LoggedOut");
};

// return logged user (valid token requeird)
export const findUser: Controller = async (req, res, next) => {
  try {
    const user = await prismax.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
    rs(req, res)("OK", user);
  } catch (error) {
    next(error);
  }
};

export const findById: Controller = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prismax.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
    if (user) rs(req, res)("OK", user);
    else rs(req, res)("NoUserFound");
  } catch (error) {
    next(error);
  }
};

// crate new user
export const create: Controller = async (req, res, next) => {
  const { email, username, password } = req.body;
  // validate request body
  if (email && username && password) {
    try {
      // chack user exist or not
      const existUser = await prismax.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!existUser) {
        // create user
        await prismax.user.create({
          data: {
            username,
            email,
            password: hashSync(password, parseInt(env("BCRYPTSALTROUND", 10))),
          },
        });
        rs(req, res)("UserCreated");
      } else {
        rs(req, res)("DuplicateUser");
      }
    } catch (error) {
      next(error);
    }
  } else {
    rs(req, res)("CreateUserFieldRequired");
  }
};

// update user
export const update: Controller = async (req, res, next) => {
  try {
    var updateQueryBody: any = {};
    if (req.body.username) updateQueryBody["username"] = req.body.username;
    if (req.body.newPassword && req.body.oldPassword) {
      if (compareSync(req.body.oldPassword, req.user.password)) {
        updateQueryBody["password"] = hashSync(
          req.body.newPassword,
          parseInt(env("c", 10))
        );
      } else {
        rs(req, res)("UnmathedRestPassword");
        return;
      }
    }
    if (Object.keys(updateQueryBody).length === 0) {
      rs(req, res)();
      return;
    }
    const user = await prismax.user.update({
      where: {
        id: req.user.id,
      },
      data: updateQueryBody,
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
    rs(req, res)("UserUpdated", user);
  } catch (error) {
    next(error);
  }
};

// delete user
export const distroy: Controller = async (req, res, next) => {
  try {
    await prismax.user.delete({
      where: {
        id: req.user.id,
      },
    });
    res.clearCookie("accessToken");
    rs(req, res)("UserDeleted");
  } catch (error) {
    next(error);
  }
};
