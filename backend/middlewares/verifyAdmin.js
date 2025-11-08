import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";

export async function verifyAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user.admin) throw new ApiError(403,'Access denied: admin only')
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message:'Internal Server error',
      error:err,
    });
  }
}
