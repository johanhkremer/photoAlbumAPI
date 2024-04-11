import { Request, Response } from "express";
import { matchedData } from "express-validator";
import {
	addPhotoToAlbum,
	addPhotosToAlbum,
	createAlbum,
	deleteAlbum,
	getAlbum,
	getAlbums,
	removePhotoFromAlbumService,
	updateAlbum,
} from "../services/album_service";
import { CreateAlbum, UpdateAlbum } from "../types/album_types";

//Get all albums
export const index = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}

	const userId = Number(req.token.sub);

	try {
		const albums = await getAlbums(userId);
		res.send({ status: "success", data: albums });
	} catch (err) {
		res.status(500).send({ status: "error", message: "Can't get albums 🛑" });
	}
};

//Get one album
export const show = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}

	const albumId = Number(req.params.albumId);
	const userId = Number(req.token.sub);

	try {
		const album = await getAlbum(albumId, userId);
		res.send({ status: "success", data: album });
	} catch (err: any) {
		if (err.code === "P2025") {
			res.status(404).send({ status: "error", message: "Not authorized to access album 🛑" });
		}
		else {
			res.status(500).send({ status: "error", message: "Can't get album 🛑" });
		}
	}
};

//Create a new album
export const store = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}
	const validateData = matchedData(req) as CreateAlbum;
	const userId = Number(req.token.sub);

	try {
		const album = await createAlbum(validateData, userId);
		res.status(201).send({ status: "success", data: album });
	} catch (err) {
		console.error(err);
		res.status(500).send({ status: "error", message: "Can't create album 🛑" });
	}
};

//Update a album
export const update = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}

	const validateData = matchedData(req) as UpdateAlbum;

	const albumId = Number(req.params.albumId);
	const userId = Number(req.token.sub);

	try {
		const album = await updateAlbum(albumId, validateData, userId);
		res.status(200).send({ status: "success", data: album });
	} catch (err: any) {
		if (err.code === "P2025") {
			res.status(404).send({ status: "error", message: "Not authorized to update album 🛑" });
		}
		else {
			res.status(500).send({ status: "error", message: "Can't update album 🛑" });
		}
	}
};

//Add a photo to an album
export const addPhoto = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}

	const albumId = Number(req.params.albumId);
	const userId = Number(req.token.sub);

	try {
		const album = await addPhotoToAlbum(albumId, req.body, userId);
		res.status(201).send({ status: "success", data: album });
	} catch (err: any) {
		// Kontrollera om felet har den specifika felkoden
		if (err.code === "PHOTO_NOT_FOUND_OR_UNAUTHORIZED") {
			res.status(404).send({ status: "error", message: err.message });
		} else {
			res.status(500).send({ status: "error", message: "Can't add photo to album 🛑" });
		}
	}
};

//Add multiple photos to an album
export const addPhotos = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}

	const albumId = Number(req.params.albumId);
	const userId = Number(req.token.sub);

	try {
		const album = await addPhotosToAlbum(albumId, req.body, userId);
		res.status(201).send({ status: "success", data: album });
	} catch (err: any) {
		// Kontrollera om felet har den specifika felkoden
		if (err.code === "PHOTOS_NOT_FOUND_OR_UNAUTHORIZED") {
			res.status(404).send({ status: "error", message: err.message });
		} else {
			res.status(500).send({ status: "error", message: "Can't add photos to album 🛑" });
		}
	}
};

//Remove photo from album
export const removePhotoFromAlbum = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}

	const albumId = Number(req.params.albumId);
	const photoId = Number(req.params.photoId);
	const userId = Number(req.token.sub);

	if (!albumId || !photoId || !userId) {
		res.status(403).send({ status: "error", message: "Not authorized to remove photos from this album" })
	}

	try {
		const album = await removePhotoFromAlbumService(albumId, photoId);
		res.status(200).send({ status: "success", data: album });
	} catch (err: any) {
		console.error(err);
		res.status(500).send({ status: "error", message: "Can't remove photo from album 🛑" });
	}
};

//Delete an album
export const destroy = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Can't access autenticated user 🛑");
	}

	const albumId = Number(req.params.albumId);
	const userId = Number(req.token.sub);

	try {
		const album = await deleteAlbum(albumId, userId);
		res.status(201).send({ status: "success", data: {} });
	} catch (err: any) {
		if (err.message === "Unauthorized attempt to delete album 🛑") {
			res.status(404).send({ status: "error", message: err.message });
		} else {
			res.status(500).send({ status: "error", message: "Can't delete album 🛑" });
		}
	}
};
