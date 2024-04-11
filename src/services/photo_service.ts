import prisma from "../prisma";
import { CreatePhoto, UpdatePhoto } from "../types/photo_types";

//GET all photos
export const getPhotos = async (userId: number) => {
	return await prisma.photo.findMany({
		where: {
			userId: userId,
		},
	});
};

//GET one photo
export const getPhoto = async (photoId: number, userId: number) => {
	return await prisma.photo.findUniqueOrThrow({
		where: {
			id: photoId,
			userId: userId,
		},
		include: {
			albums: true,
		},
	});
};

//Create a photo
export const createPhoto = async (data: CreatePhoto, userId: number) => {
	return await prisma.photo.create({
		data: {
			...data,
			userId: userId,
		},
	});
};

//Update a photo
export const updatePhoto = async (
	photoId: number,
	data: UpdatePhoto,
	userId: number
) => {
	return await prisma.photo.update({
		where: {
			id: photoId,
			userId: userId,
		},
		data,
	});
};

//Delete an photo
export const deletePhoto = async (photoId: number, userId: number) => {
	const photo = await prisma.photo.findUnique({
		where: { id: photoId }
	});

	if (!photo || photo.userId !== userId) {
		throw new Error("Unauthorized attempt to delete photo 🛑");
	}

	return await prisma.photo.delete({
		where: {
			id: photoId,
		},
	});
}
