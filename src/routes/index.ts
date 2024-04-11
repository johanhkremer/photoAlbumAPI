/**
 * Main application routes
 */
import express from "express";
import albumRoutes from "./album";
import photoRoutes from "./photo";
import profileRoutes from "./profile";
import { login, refresh, register } from "../controllers/user_controller";
import { loginRules, registerRules } from "../validations/profile_rules";
import validateRequest from "../middlewares/validate_request";
import { validateAccessToken } from "../middlewares/auth/jwt";

const router = express.Router();

//Albums
router.use("/albums", validateAccessToken, albumRoutes);

//Photos
router.use("/photos", validateAccessToken, photoRoutes);

//Login (Authentication)
router.post("/login", loginRules, validateRequest, login);

//Refresh (Authentication)
router.use("/refresh", validateRequest, refresh);

//Profile
router.use("/profile", validateAccessToken, profileRoutes);

//Register (Authentication)
router.post("/register", registerRules, validateRequest, register);

/**
 * Catch-all route handler
 */
router.use((req, res) => {
	// Respond with 404 and a message in JSON-format
	res.status(404).send({
		message: "Route Not Found",
	});
});

export default router;
