import { Request } from "express";
import { ResponseCodes } from "src/utils/iresCode";
import codeResource from "../utils/resCodes";
const { networkInterfaces } = require("os");

type ENV = (key: string, defaultValue?: any) => string;
export const env: ENV = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

export const printAddress = () => {
  const port = env("PORT", 3000);
  const links = [];
  let nets = networkInterfaces();
  // console.log(nets);

  for (const interfaceName of Object.keys(nets)) {
    for (const net of nets[interfaceName]) {
      if (net.family === "IPv4") {
        links.push(`   http://${net.address}:${port}`);
      }
    }
  }
  console.log(links.join("\n"));
  console.log("\x1b[34m", `> Worker Process ID: `, "\x1b[0m");
};

type ByteConverter = (
  bytes: number,
  isString?: boolean
) => string | { value: number; unit: string };
export const byteConverter: ByteConverter = (bytes, isString = true) => {
  // declear var
  const units = ["B", "KB", "MB"];
  let defaultUnit = "B";

  // downgrad bytes unit
  for (let i = 0; i < units.length; i++) {
    defaultUnit = units[i];
    if (bytes >= 1024 && units.length > i + 1) {
      bytes = bytes / 1024;
    } else break;
  }
  bytes = parseFloat(bytes.toFixed(2));
  if (isString) return `${bytes + defaultUnit}`;

  return {
    value: bytes,
    unit: defaultUnit,
  };
};

export function getRequestSize(req: Request): number {
  if (Object.keys(req.body).length)
    return Buffer.from(JSON.stringify(req.body)).length;

  return 0;
}

export function getResponseSize(body: object): number {
  return Buffer.from(JSON.stringify(body)).length;
}

export function getResponseCM(
  code: ResponseCodes["ResultCode"] | ResponseCodes["ErrorCode"] | undefined,
  req: Request
): [
  code: number,
  message: string,
  strCode: ResponseCodes["ResultCode"] | ResponseCodes["ErrorCode"]
] {
  code = code || "OK";
  return [
    codeResource[code].code,
    codeResource[code].message
      .replace("[METHOD]", req.method)
      .replace("[URL]", req.originalUrl),
    code,
  ];
}
