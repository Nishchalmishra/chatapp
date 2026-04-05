import { Router } from "express";
import { getAllContacts, getChatByUserId, sendMessage,getChatPartners } from "../controllers/message.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = Router();

router.use(arcjetProtection, protectedRoute)

router.route("/contacts").get(getAllContacts)
router.route("/chat").get(getChatPartners)
router.route("/:id").get(getChatByUserId)
router.route("/send/:id").post(sendMessage)

export default router