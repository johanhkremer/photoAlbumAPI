import Debug from "debug";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import {
	createPhoto,
	deletePhoto,
	getPhoto,
	getPhotos,
	updatePhoto,
} from "../services/photo_service";
import { CreatePhoto, UpdatePhoto } from "../types/photo_types";

const debug = Debug("Photo albums: photo_controller");

//Get all photos
export const index = async (req: Request, res: Response) => {
	if (!req.token) {
		return res.status(401).send({ status: "fail", message: "Authentication required 🛑" });
	}

	const userId = req.token.sub;

	try {
		const photos = await getPhotos(userId);
		res.send({ status: "success", data: photos });
	} catch (err) {
		res.status(500).send({ status: "error", message: "Can't get photos 🛑" });
	}
};

//Get one photo
export const show = async (req: Request, res: Response) => {
	const photoId = Number(req.params.photoId);

	if (!req.token) {
		return res.status(401).send({ status: "fail", message: "Authentication required" });
	}

	const userId = req.token.sub;

	try {
		const photo = await getPhoto(photoId, userId);
		res.send({ status: "success", data: photo });
	} catch (err: any) {
		if (err.code === "P2025") {
			res.status(401).send({ status: "error", message: "Unauthorized attempt to access photo 👮‍♂️🛑" });
		}
		else {
			res.status(500).send({ status: "error", message: "Can't get photo 🛑" });
		}
	}
};

//Create a new photo
export const store = async (req: Request, res: Response) => {
	const validateData = matchedData(req) as CreatePhoto;

	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}

	const userId = req.token.sub;

	try {
		const photo = await createPhoto(validateData, userId);
		res.status(201).send({ status: "success", data: photo });
	} catch (err) {
		console.error(err);
		res.status(500).send({ status: "error", message: "Can't create photo 🛑" });
	}
};

//Update a photo
export const update = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}
	const validateData = matchedData(req) as UpdatePhoto;

	const photoId = Number(req.params.photoId);
	const userId = req.token.sub;

	try {
		const photo = await updatePhoto(photoId, validateData, userId);
		res.status(200).send({ status: "success", data: photo });
	} catch (err: any) {
		if (err.code === "P2025") {
			res.status(401).send({ status: "error", message: "Unauthorized attempt to update photo 👮‍♂️🛑" });
		}
		else {
			res.status(500).send({ status: "error", message: "Can't update photo 🛑" });
		}
	}
};

//Delete a photo
export const destroy = async (req: Request, res: Response) => {
	if (!req.token) {
		return res.status(401).send("Can't access autenticated user 🛑");
	}

	const photoId = Number(req.params.photoId);
	const userId = Number(req.token.sub);

	try {
		const photo = await deletePhoto(photoId, userId);
		res.status(200).send({ status: "success", data: {} });
	} catch (err: any) {
		if (err.message === "Unauthorized attempt to delete photo 🛑") {
			res.status(403).send({ status: "error", message: err.message });
		} else {
			res.status(500).send({ status: "error", message: "Can't delete photo 🛑" });
		}
	}
};
