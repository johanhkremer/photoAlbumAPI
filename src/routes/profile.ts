import express from "express";
import { getProfile, updateProfile } from "../controllers/profile_controller";
import { updateUserRules } from "../validations/profile_rules";
import validateRequest from "../middlewares/validate_request";

//import { updateUserRules } from "../validations/profile_rules";

const router = express.Router();

//GET one User
router.get("/", getProfile);

//PATCH update a user
router.patch("/", updateUserRules, validateRequest, updateProfile);

export default router;
