import { connectdb } from "./config/db.conf";
import { isProduction } from "./utils/func.utils";


export default class Bootloader{

  public static async register() {
    
  }

  public static async boot() {
    await connectdb();
    if (isProduction()) {
      // production
    } else {
      // development
    }
  }
};
