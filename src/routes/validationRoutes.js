import { Router } from "express";

import loginValidate from "../middlewares/loginValidate";
import ValidationController from "../controllers/ValidationController";

const router = new Router();

router.post("/", loginValidate, ValidationController.index);

export default router;
