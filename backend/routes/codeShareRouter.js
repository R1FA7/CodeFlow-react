import { Router } from "express";
import { getCode, storeCode } from "../controllers/codeShareController.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const codeShareRouter = Router() 

codeShareRouter.post('/', verifyJWT, storeCode)
codeShareRouter.get('/:shareId', getCode)

export { codeShareRouter };

