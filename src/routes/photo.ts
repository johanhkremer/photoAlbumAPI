import express from "express";
import {
	destroy,
	index,
	show,
	store,
	update,
} from "../controllers/photo_controller";
import { createPhotoRules, updatePhotoRules } from "../validations/photo_rules";
import validateRequest from "../middlewares/validate_request";

const router = express.Router();

//GET all Photos
router.get("/", index);

//GET one Photo
router.get("/:photoId", show);

//POST create a new photo
router.post("/", createPhotoRules, validateRequest, store);

//PATCH update a photo
router.patch("/:photoId", updatePhotoRules, validateRequest, update);

//DELETE delete an photo
router.delete("/:photoId", destroy);

export default router;
