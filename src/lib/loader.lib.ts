import { env, isProduction } from "./../utils/func.utils";
const { networkInterfaces, hostname } = require("os");

export const printAddress = () => {
  const port = env("PORT", 3000);
  const links = [];
  let nets = networkInterfaces();

  for (const interfaceName of Object.keys(nets)) {
    for (const net of nets[interfaceName]) {
      if (net.family === "IPv4") {
        links.push(`   http://${net.address}:${port}\t| MAC: ${net.mac}`);
      }
    }
  }
  console.log(links.join("\n"));
  console.log(`   http://${hostname()}:${port}`);
  console.log("\x1b[34m", `> Worker Process ID: `, "\x1b[0m");
};
export function hasCluster() {
  return !!process.env.CLUSTER;
}
export function printPrimaryPid() {
  if (!isProduction()) {
    console.clear();
  }
  // prettier-ignore
  console.log("\x1b[34m", `> Primary process ${process.pid} Started`, "\x1b[0m");
}
export function printServerStarting() {
  if (isProduction())
    console.log("\x1b[34m", `> Production server starting`, "\x1b[0m");
  else console.log("\x1b[34m", `> Development server starting`, "\x1b[0m");
}
