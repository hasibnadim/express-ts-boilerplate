import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { Controller } from "../types";

export const sReport: Controller = (req, res) => {
  let folderDir = join(homeDir, "logs");
  let data: any[] = [];
  if (existsSync(folderDir)) {
    // get log name by file name and convert it to date
    var dirList: string[] = readdirSync(folderDir);
    for (let l of dirList) {
      // discover date number form file name
      let dateArr = l
        .replace(/log-|.json/, "")
        .split("-")
        .map((v) => parseInt(v));

      // date number to date string

      data.push({
        ...JSON.parse(readFileSync(join(folderDir, l)).toString()),
        dateArr,
      });
    }

    data = data
      .sort((a, b) => b.dateArr[0] - a.dateArr[0])
      .sort((a, b) => b.dateArr[1] - a.dateArr[1])
      .sort((a, b) => b.dateArr[2] - a.dateArr[2])
      .sort((a, b) => b.dateArr[3] - a.dateArr[3])
      .map((v) => ({
        ...v,
        dateString: new Date(
          v.dateArr[3],
          v.dateArr[2] - 1,
          v.dateArr[1],
          v.dateArr[0]
        ).toLocaleString("en-US", {
          //new Date(year, monthIndex, day, hours)
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          hour12: true,
        }),
      }));

    // sort log by date
  }

  res.render("serverReport", { title: "Server Report", data });
};
