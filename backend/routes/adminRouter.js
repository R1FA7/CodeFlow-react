import { Router } from "express";
import { acceptContest, getAllContests, rejectContest } from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const adminRouter = Router();

adminRouter.get("/", verifyJWT, verifyAdmin, getAllContests);
adminRouter.post("/:id", verifyJWT, verifyAdmin, acceptContest);
adminRouter.delete("/:id", verifyJWT, verifyAdmin, rejectContest);

export { adminRouter };

