const codeResource = {
  RouteNotFound: {
    status: 404,
    message: "[METHOD]:[URL] not found!",
  },
  OK: {
    status: 200,
    message: "Action Successful",
  },
  ERR: {
    status: 500,
    message: "Opps! Something is wrong",
  },
  NoClientFound: {
    status: 404,
    message: "No Client Found",
  },
};
export type CRcodes = keyof typeof codeResource;
export interface IErrorResp {
  code: CRcodes;
  message: string;
  status: number;
  data?: any;
}

export function buildResponse(code: CRcodes, data?: any): IErrorResp {
  return {
    code,
    status: codeResource[code].status,
    message: codeResource[code].message,
    data,
  };
}
