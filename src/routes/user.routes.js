import {Router} from "express";
import { registerUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = Router() // userRouter in app.js (Common router h but abhi as userRouter use horaha h we can use it as a common router also )

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

router.route("/").get((req, res) => {
    res.status(200).json({
        message: "User routes working!"
    })
})

export default router