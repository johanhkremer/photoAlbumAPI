import prisma from "../prisma";
import { CreateUser, UpdateUser } from "../types/user_types";

//Get the user`s profile by email
export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email,
		},
	});
};

//Get the user`s profile by id
export const getUserById = async (userId: number) => {
	return await prisma.user.findUniqueOrThrow({
		where: {
			id: userId,
		},
		select: {
			id: true,
			email: true,
			first_name: true,
			last_name: true,
			password: false,
		},
	});
};

//Update the user´s profile
export const updateUsersProfile = async (userId: number, data: UpdateUser) => {
	return await prisma.user.update({
		where: {
			id: userId,
		},
		data,
		select: {
			id: true,
			email: true,
			first_name: true,
			last_name: true,
			password: false,
		},
	});
};

//Register a new user
export const createUser = async (data: CreateUser) => {
	return await prisma.user.create({
		select: {
			id: true,
			email: true,
			password: false,
			first_name: true,
			last_name: true,
		},
		data,
	});
};
