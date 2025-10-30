import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";

export async function verifySetter(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if ((await user.rating()) < 100) {
        if (!user.admin) throw new ApiError(403,'Access denied: only setter')
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({
          error: "Unauthorized",
      });
    }
}
