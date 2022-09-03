//@collapse
import { Prisma } from "@prisma/client";
import { readFileSync, writeFileSync } from "fs";
import { ResponseCodes } from "../utils/iresCode";
import { byteConverter, env } from "./common.service";

interface logParams {
  resultCode: ResponseCodes["ResultCode"] | ResponseCodes["ErrorCode"];
  resSize: number;
  urlKey: string;
  error?: Error;
}
interface queryLogType {
  action: Prisma.PrismaAction;
  model: string | undefined;
  status: string;
}
interface stageLogerType {
  execStart: number;
  reqSize: number;
}
var currentLogFileDir = "";
var stageValue: stageLogerType;
var queryLogList: {
  [key in string]: any;
} = {};

process.on("message", (msg: { cmd: string; data: any }) => {
  if (msg.cmd) {
    currentLogFileDir = msg.data;
  }
});

export const stageLoger = (v: stageLogerType) => {
  stageValue = v;
};

const queryLogBuilder = (existQuery: any, currentQuery: any): object => {
  for (const model of Object.keys(currentQuery)) {
    for (const action of Object.keys(currentQuery[model])) {
      if (!existQuery[model]) existQuery[model] = {};
      existQuery[model][action] =
        (existQuery[model][action] || 0) + currentQuery[model][action];
    }
  }

  return existQuery;
};

export const log = async (l: logParams) => {
  if (env("NODE_ENV") === "development") {
    // request log
    let string = `${l.urlKey} | ${l.resultCode} | `;
    string += `rq:${byteConverter(stageValue.reqSize)}, rs:${byteConverter(
      l.resSize
    )}`;
    string += ` | ${Date.now() - stageValue.execStart}ms`;
    if (l.error) {
      string += ` | ${l.error.name}`;
    }
    for await (const qkey of Object.keys(queryLogList)) {
      string += `\nModel: ${qkey}`;
      for await (const actionKey of Object.keys(queryLogList[qkey])) {
        string += `, ${actionKey}: ${queryLogList[qkey][actionKey]}`;
      }
    }

    console.log(string);
    if (l.error) {
      console.log("\x1b[31m", l.error.message, "\x1b[0m");
    }
  } else {
    let errors = [];
    let logJson = JSON.parse(readFileSync(currentLogFileDir).toString());
    let theEndPoints = logJson.endPoints?.[l.urlKey];
    if (l.error) {
      errors.push(`${new Date().toLocaleString("en-US")}${l.error.message}`);
    }
    logJson = {
      ...logJson,
      endPoints: {
        ...(logJson.endPoints || {}),
        [l.urlKey]: {
          ...(theEndPoints || {}),
          // total hits to the endpoint
          totalHis: (theEndPoints?.totalHis || 0) + 1,

          // total Byes of data received to the endpoint
          totalReceivedByes:
            (theEndPoints?.totalReceivedByes || 0) + stageValue.reqSize,

          // total Byes of data send to the endpoint
          totalSendByes: (theEndPoints?.totalSendByes || 0) + l.resSize,

          // total response time to for endpoint (milisecond)
          totalResponsTime:
            (theEndPoints?.totalResponsTime || 0) +
            (Date.now() - stageValue.execStart),

          // number of Action executed
          Action: {
            [l.resultCode]: (theEndPoints?.Action?.[l.resultCode] || 0) + 1,
          },
          query: queryLogBuilder(theEndPoints?.query || {}, queryLogList),
          errors: [...(theEndPoints?.errors || []), ...errors],
        },
      },
    };

    writeFileSync(currentLogFileDir, JSON.stringify(logJson, null, 2));
  }

  // reset query log variable
  queryLogList = {};
};

export const queryLog = ({ model, action, status }: queryLogType) => {
  queryLogList[model + ""] = {
    ...(queryLogList?.[model + ""] || {}),
    [action + ""]: (queryLogList?.[model + ""]?.[action + ""] || 0) + 1,
  };
};
