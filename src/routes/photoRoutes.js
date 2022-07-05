import { Router } from "express";

import photoController from "../controllers/PhotoController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.put("/:id?", loginRequired, photoController.update);

export default router;
