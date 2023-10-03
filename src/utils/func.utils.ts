import { ByteConverter, ENV } from "./type";

export function getCamelCase(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}


export const env: ENV = (key, defaultValue) => {
  return process.env[key] || defaultValue || "";
};

export const isProduction=():boolean=>{
  return env("NODE_ENV") !== "development";
}


export const byteConverter: ByteConverter = (bytes, isString = true) => {
  // declear var
  const units = ["B", "KB", "MB"];
  let i = 0;
  // downgrad bytes unit
  for (; i < units.length; i++) {
    if (bytes >= 1024 && units.length > i + 1) {
      bytes = bytes / 1024;
    } else break;
  }
  bytes = parseFloat(bytes.toFixed(2));
  if (isString) return `${bytes + units[i]}`;

  return {
    value: bytes,
    unit: units[i],
  };
};

export function getObjectSize(obj:Object): number {
  if (Object.keys(obj).length)
    return Buffer.from(JSON.stringify(obj)).length;

  return 0;
}