export interface ResponseCodes {
  // After edit it please chack file://./resCodes.ts file to add Code number and message
  ResultCode:
    | "OK"
    | "LoggedIn"
    | "LoggedOut"
    | "UserUpdated"
    | "UserCreated"
    | "UserDeleted";
  ErrorCode:
    | "ERR"
    | "RouteNotFound"
    | "NoUserFoundForLogin"
    | "NoUserFound"
    | "InvalidSession"
    | "LoginFieldRqueird"
    | "UnmathedRestPassword"
    | "CreateUserFieldRequired"
    | "DuplicateUser";
}
