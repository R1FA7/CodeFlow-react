import { Router } from "express";
import { createSubmission, getAllSubmissions, runPlayground } from "../controllers/submissionController.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const submissionRouter = Router() 

submissionRouter.get('/', verifyJWT, getAllSubmissions)
submissionRouter.post('/', verifyJWT, createSubmission)
submissionRouter.post('/playground', runPlayground)

export { submissionRouter };
