import { isProduction } from "./../utils/func.utils";
import winston from "winston";
const { combine, timestamp, prettyPrint, label, printf } = winston.format;

const rlogger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
  // defaultMeta: { service: "request" },
  transports: [ ],
});

if (!isProduction()) {
  const consolFormate = printf(({ level, message, label, timestamp }) => {
    let t = new Date(timestamp);
    let data = `${message.endpoint} | ${message.response.data.code} | ${message.request.byteSize} -> ${message.response.byteSize}`;
    return `${t.toLocaleTimeString()} [${label}] ${level}: ${data}`;
  });
  rlogger.add(
    new winston.transports.Console({
      format: combine(label({ label: "HTTP" }), consolFormate)
    })
  );
} else {
  rlogger.add(
    new winston.transports.File({ filename: "storage/logs/error.log", level: "error" })
  );
  rlogger.add(
    new winston.transports.File({ filename: "storage/logs/warn.log", level: "warn" })
  );
  rlogger.add(
    new winston.transports.File({ filename: "storage/logs/info.log", level: "info" })
  );
}
const debug=(...args:any[])=>{
  if (!isProduction()) {
    console.debug(...args)
  }
}
export { rlogger as logger,debug };
