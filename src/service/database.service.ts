//

import { PrismaClient } from "@prisma/client";
import { env } from "./common.service";
import { queryLog } from "./logger.service";

export const prismax = new PrismaClient();

prismax.$use(async (params, next) => {
  var result;
  // try {
  result = await next(params);
  queryLog({ model: params.model, action: params.action, status: "DONE" });
  // } catch (error) {}

  return result;
});

prismax.$on("beforeExit", () => {
  prismax.$disconnect();
});

export const connectdb = async () => {
  try {
    await prismax.$connect();
    console.log(`🚀 Database connected ${PrismaClient.name}.`);
  } catch (error) {
    console.log(
      "\x1b[31m",
      ` ❌ Database Connection failed: ${error}`,
      "\x1b[0m"
    );
    if (env("USEDB") === "true") {
      console.log(`Process ${process.pid} is exiting.`);
      console.log(`We need to use database, [USEDB=true].`);
      process.exit();
    }
  }
};
