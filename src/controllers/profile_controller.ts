import bcrypt from "bcrypt";
import Debug from "debug";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import {
	getUserById,
	updateUsersProfile,
} from "../services/profile_service";
import { UpdateUser } from "../types/user_types";

const debug = Debug("Photo albums: profile_controller");

//Get autenticated user's profile
export const getProfile = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Cannot access user, is autentication disabled? 🛑");
	}

	const user = await getUserById(req.token.sub);

	res.status(200).send({ status: "success", data: user });
};

//Update autenticated user's profile
export const updateProfile = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error("Cannot access user, is autentication disabled? 🛑");
	}

	const validateData = matchedData(req) as UpdateUser;

	try {
		const userId = await getUserById(req.token.sub);

		const updatedUser = await updateUsersProfile(userId.id, validateData);

		res.status(200).send({ status: "success", data: updatedUser });
	} catch (err: any) {
		if (err.code === "P2025") {
			res.status(401).send({ status: "error", message: "Unauthorized attempt to update photo 👮‍♂️🛑" });
		} else {
			res.status(500).send({ status: "error", message: "Can't update user's profile 🛑" });
		}

	}
};
