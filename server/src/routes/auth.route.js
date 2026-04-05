import { Router } from "express"
import { userSignUp, userLogin, userLogout, userUpdate } from "../controllers/auth.controller.js"
import { protectedRoute } from "../middlewares/auth.middleware.js"
import { upload } from "../lib/utils/multer.js"
import { arcjetProtection } from "../middlewares/arcjet.middleware.js"

const router = Router()

router.route("/test").get( arcjetProtection, (req, res) => res.status(200).json({ message: "Arcjet is working" }))
router.route("/signup").post(arcjetProtection, userSignUp)
router.route("/login").post(arcjetProtection, userLogin)
router.route("/logout").post(arcjetProtection, userLogout)
router.route("/update").put(arcjetProtection, upload.single("avatar"), protectedRoute, userUpdate)
router.route("/check").get(protectedRoute, (req, res) => {
    res.status(200).json(req.user)
})

export default router  