require("dotenv").config();
import { Cluster } from "cluster";
import { isProduction } from "./utils/func.utils";
import Boot from "./boot";
import * as loader from "./lib/loader.lib";

const startDevServer = async () => {
  loader.printPrimaryPid();
  loader.printServerStarting();
  await Boot.boot();
  require("./server");
  await Boot.register();
  loader.printAddress();
};

const startProdServer = async () => {
  if (loader.hasCluster()) {
    const cluster: Cluster = require("cluster");
    if (cluster.isPrimary) {
      const numCPUs = require("os").cpus().length - 1 || 1;
      loader.printPrimaryPid();
      loader.printServerStarting();
      await Boot.boot();
      loader.printAddress();

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on("exit", (worker) => {
        // prettier-ignore
        console.log("\x1b[31m",`  worker ${worker.process.pid} died`,"\x1b[0m");
        cluster.fork();
      });
    } else {
      require("./server");
      await Boot.register();
    }
  } else {
    loader.printPrimaryPid();
    loader.printServerStarting();
    await Boot.boot();
    require("./server");
    await Boot.register();
    loader.printAddress();
  }
};

(async function () {
  if (isProduction()) {
    startProdServer();
  } else {
    startDevServer();
  }
})();
