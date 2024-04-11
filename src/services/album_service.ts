import prisma from "../prisma";
import { CreateAlbum, UpdateAlbum } from "../types/album_types";
import { PhotoId } from "../types/photo_types";

//GET all albums
export const getAlbums = async (userId: number) => {
	return await prisma.album.findMany({
		where: {
			userId: userId,
		},
		include: {
			photos: true,
		},
	});
};

//GET one album
export const getAlbum = async (albumId: number, userId: number) => {
	return await prisma.album.findUniqueOrThrow({
		where: {
			id: albumId,
			userId: userId,
		},
		include: {
			photos: true,
		},
	});
};

//Create an album
export const createAlbum = async (data: CreateAlbum, userId: number) => {
	return await prisma.album.create({
		data: {
			title: data.title,
			user: {
				connect: { id: userId },
			},
		},
	});
};

//Update an album
export const updateAlbum = async (
	albumId: number,
	data: UpdateAlbum,
	userId: number
) => {
	return await prisma.album.update({
		where: {
			id: albumId,
			userId: userId,
		},
		include: {
			photos: true,
		},
		data: {
			title: data.title,
			user: {
				connect: { id: userId },
			},
		},
	});
};

//Add a photo to album
export const addPhotoToAlbum = async (albumId: number, photoId: PhotoId, userId: number) => {

	// Check if the album exists and if the user is authorized to add photos to it
	const album = await prisma.album.findUnique({
		where: { id: albumId },
	});

	if (!album || album.userId !== userId) {
		throw new Error("Album not found or user not authorized to add photos to this album");
	}

	// Check if the photo exists and belongs to the user
	const photo = await prisma.photo.findUnique({
		where: {
			id: photoId.id,
			userId: userId,
		},
	});

	if (!photo) {
		const error: any = new Error("Photo not found or user not authorized to add this photo to the album 🛑");
		error.code = "PHOTO_NOT_FOUND_OR_UNAUTHORIZED";
		throw error;
	}

	return await prisma.album.update({
		where: {
			id: albumId,
		},
		data: {
			photos: {
				connect: photoId,
			},
		},
		include: {
			photos: true,
		},
	});
};

//Add photos to album
export const addPhotosToAlbum = async (albumId: number, photoId: PhotoId[], userId: number) => {

	// Check if the album exists and if the user is authorized to add photos to it
	const album = await prisma.album.findUnique({
		where: { id: albumId },
	});

	if (!album || album.userId !== userId) {
		throw new Error("Album not found or user not authorized to add photos to this album");
	}

	// Get all photo IDs
	const ids = photoId.map(photo => photo.id);

	// Get all photos that match the IDs and belong to the user
	const photos = await prisma.photo.findMany({
		where: {
			id: { in: ids },
			userId: userId,
		},
	});

	// If the number of photos found does not match the number of IDs, throw an error
	if (photos.length !== ids.length) {
		const error: any = new Error("One or more photos not found or user not authorized to add these photos to the album 🛑");
		error.code = "PHOTOS_NOT_FOUND_OR_UNAUTHORIZED";
		throw error;
	}

	return await prisma.album.update({
		where: {
			id: albumId,
			userId: userId,
		},
		data: {
			photos: {
				connect: photoId,
			},
		},
		include: {
			photos: true,
		},
	});
};

//Remove a photo from an album
export const removePhotoFromAlbumService = async (albumId: number, photoId: number) => {
	return await prisma.album.update({
		where: {
			id: albumId,
		},
		data: {
			photos: {
				disconnect: {
					id: photoId,
				},
			},
		},
		include: {
			photos: true,
		},
	});
};

//Delete an album
export const deleteAlbum = async (albumId: number, userId: number) => {
	const album = await prisma.album.findUnique({
		where: { id: albumId },
	});

	if (!album || album.userId !== userId) {
		throw new Error("Unauthorized attempt to delete album 🛑");
	}

	return await prisma.album.delete({
		where: {
			id: albumId,
			userId: userId,
		},
	});
}
