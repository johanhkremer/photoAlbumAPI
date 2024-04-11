import express from "express";
import {
	addPhoto,
	addPhotos,
	destroy,
	index,
	removePhotoFromAlbum,
	show,
	store,
	update,
} from "../controllers/album_controller";
import { createAlbumRules, updateAlbumRules } from "../validations/album_rules";
import validateRequest from "../middlewares/validate_request";

const router = express.Router();

//GET all Albums
router.get("/", index);

//GET one Album
router.get("/:albumId", show);

//POST create a new album
router.post("/", createAlbumRules, validateRequest, store);

//PATCH update a album
router.patch("/:albumId", updateAlbumRules, validateRequest, update);

//POST add a photo to an album
router.post("/:albumId/photo", addPhoto);

//POST add multiple photos to an album
router.post("/:albumId/photos", addPhotos);

//DELETE remove a photo from an album
router.delete("/:albumId/photos/:photoId", removePhotoFromAlbum);

//DELETE delete an album
router.delete("/:albumId", destroy);

export default router;
