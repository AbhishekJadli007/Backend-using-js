import {Router} from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";

const router = Router() // userRouter in app.js (Common router h but abhi as userRouter use horaha h we can use it as a common router also )

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/").get((req, res) => {
    res.status(200).json({
        message: "User routes working!"
    })
})

export default router