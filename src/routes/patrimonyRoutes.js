import { Router } from "express";

import patrimonyController from "../controllers/PatrimonyController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, patrimonyController.store);
router.get("/", patrimonyController.index);
router.get("/:id", patrimonyController.show);
router.put("/:id?", loginRequired, patrimonyController.update);
router.delete("/:id?", loginRequired, patrimonyController.delete);

export default router;
