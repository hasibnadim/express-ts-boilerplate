import { ResponseCodes } from "./iresCode";

type CodeResource = {
  [key in ResponseCodes["ResultCode"] | ResponseCodes["ErrorCode"]]: {
    code: number;
    message: string;
  };
};
const codeResource: CodeResource = {
  RouteNotFound: {
    code: 404,
    message: "[METHOD]:[URL] not found!",
  },
  OK: {
    code: 200,
    message: "Action Successful",
  },
  ERR: {
    code: 500,
    message: "Opps! Something is wrong",
  },
  NoUserFoundForLogin: {
    code: 404,
    message: "Email or password is wrong.",
  },
  NoUserFound: {
    code: 404,
    message: "Opps! No user found.",
  },
  InvalidSession: {
    code: 425,
    message: "Session isn't valid.",
  },
  LoggedIn: {
    code: 200,
    message: "Login Successfull",
  },
  LoggedOut: {
    code: 200,
    message: "LogOut Successfull",
  },
  LoginFieldRqueird: {
    code: 425,
    message: "Email and Password is required!",
  },
  UnmathedRestPassword: {
    code: 425,
    message: "Invalid Old Password",
  },
  UserUpdated: {
    code: 200,
    message: "User Update Successfully",
  },
  CreateUserFieldRequired: {
    code: 425,
    message: "Valid Email, Username & Password is Required!",
  },
  UserCreated: {
    code: 201,
    message: "User has beed created successfully",
  },
  DuplicateUser: {
    code: 409,
    message: "User for the email is already exist! please login!",
  },
  UserDeleted: {
    code: 200,
    message: "User deleted successfully",
  },
};
export default codeResource;
