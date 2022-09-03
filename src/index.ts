//@collapse
require("dotenv").config();
import { connectdb } from "./service/database.service";
import { env, printAddress } from "./service/common.service";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { Cluster } from "cluster";

// set home dir
declare global {
  var homeDir: string;
}

global.homeDir = join(__dirname, "..");

const initPrimaryTask = () => {
  if (env("NODE_ENV") !== "development") {
    let now = new Date();
    let fileName = `log-${now.getHours()}-${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}.json`;
    let folderDir = join(homeDir, "logs");

    if (!existsSync(folderDir)) mkdirSync(folderDir);

    let fileDir = join(folderDir, fileName);
    writeFileSync(
      fileDir,
      JSON.stringify({ serverStarted: Date.now() }, null, 1)
    );
    return { fileDir };
  }
};

const startDevServer = async () => {
  initPrimaryTask();
  console.log(
    "\x1b[34m",
    `> Primary process ${process.pid} Started`,
    "\x1b[0m"
  );
  console.log("\x1b[34m", `> Development server starting`, "\x1b[0m");
  await connectdb();
  require("./server");
  printAddress();
};

const startProdServer = async () => {
  const cluster: Cluster = require("cluster");
  if (cluster.isPrimary) {
    const numCPUs = require("os").cpus().length - 1 || 1;
    var primaryTaskData = initPrimaryTask();
    console.log(
      "\x1b[34m",
      `> Primary process ${process.pid} Started.`,
      "\x1b[0m"
    );
    console.log("\x1b[34m", `> Production server starting`, "\x1b[0m");
    await connectdb();
    printAddress();
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("fork", function (worker) {
      worker.send({ cmd: "SetLogDir", data: primaryTaskData?.fileDir });
    });
    cluster.on("exit", (worker) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    require("./server");
  }
};

(async function () {
  if (env("NODE_ENV") === "development") {
    startDevServer();
  } else {
    startProdServer();
  }
})();
