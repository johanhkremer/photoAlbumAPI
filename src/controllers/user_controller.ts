import bcrypt from "bcrypt";
import Debug from "debug";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import jwt from "jsonwebtoken";
import {
	createUser,
	getUserByEmail,
	getUserById,
} from "../services/profile_service";
import { CreateUser } from "../types/user_types";
import { JwtPayload, JwtRefreshPayload } from "../types/token_types";
import { extractAndValidateAuthHeader } from "../helpers/auth.helper";

const debug = Debug("Photo albums: user_controller");

interface LoginRequestBody {
	email: string;
	password: string;
}

//Login
export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body as LoginRequestBody;

	//Get User by email for validation
	const user = await getUserByEmail(email);

	if (!user) {
		debug("User %s does not exist", email);
		return res.status(401).send({ status: "fail", message: "Authentication required 🛑" });
	}

	const result = await bcrypt.compare(password, user.password);
	if (!result) {
		debug("User %s password did not match", email);
		return res.status(401).send({ status: "fail", message: "Authentication required 🛑" });
	}

	//Construct jwt payload
	const payload: JwtPayload = {
		sub: user.id,
		name: user.first_name && user.last_name,
		email: user.email,
	};

	//Sign payload with access token secret and get access token
	if (!process.env.ACCESS_TOKEN_SECRET) {
		debug("Access token is MIA in .env");
		return res.status(500).send({
			status: "fail",
			message: "No access token secret defined 🛑",
		});
	}
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "4h",
	});

	//Refresh jwt payload
	const refreshPayload: JwtRefreshPayload = {
		sub: user.id,
	};

	//Sign payload with refresh token secret and get refresh token
	if (!process.env.REFRESH_TOKEN_SECRET) {
		debug("Access token is MIA in .env");
		return res.status(500).send({
			status: "fail",
			message: "No access token secret defined 🛑",
		});
	}
	const refresh_token = jwt.sign(
		refreshPayload,
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_LIFETIME || "1d",
		}
	);

	//Respond with new access token
	res.send({
		status: "success",
		data: {
			access_token,
			refresh_token,
		},
	});
};

//Refresh token
export const refresh = async (req: Request, res: Response) => {
	let token: string;

	try {
		token = extractAndValidateAuthHeader(req, "Bearer");
	} catch (err) {
		if (err instanceof Error)
			return res
				.status(401)
				.send({ status: "fail", message: err.message });
		return res
			.status(401)
			.send({ statsus: "fail", massage: "Unknown authentication error 🛑" });
	}

	//Verify refresh token and extract payload or bail

	if (!process.env.REFRESH_TOKEN_SECRET) {
		debug("Access token is MIA in .env");
		return res.status(500).send({
			status: "fail",
			message: "No access token secret defined 🛑",
		});
	}

	try {
		//Verify token
		const refreshPayload = jwt.verify(
			token,
			process.env.REFRESH_TOKEN_SECRET
		) as unknown as JwtRefreshPayload;
		debug("refresh payload: %0", refreshPayload);
		//Get user from DB (by id)
		const user = await getUserById(refreshPayload.sub);
		if (!user) {
			debug("User is MIA");
			return res
				.status(500)
				.send({ status: "error", message: "Access denied 🛑" });
		}

		//Construct jwt payload
		const payload: JwtPayload = {
			sub: user.id,
			name: user.first_name && user.last_name,
			email: user.email,
		};

		//Issue new access token
		if (!process.env.ACCESS_TOKEN_SECRET) {
			debug("Access token is MIA in .env");
			return res.status(500).send({
				status: "fail",
				message: "No access token secret defined 🛑",
			});
		}
		const access_token = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "4h",
			}
		);

		//Respond with new access token
		res.send({
			status: "success",
			data: {
				access_token,
			},
		});
	} catch (err) {
		debug("JWT verify failed: %0", err);
		return res
			.status(401)
			.send({ status: "failed", message: "Authentication failed 🛑" });
	}
};

//Register a new user
export const register = async (req: Request, res: Response) => {
	const validateData = matchedData(req);
	debug("validateData: %0", validateData);

	//Hash 🍳 and salt 🧂 password
	//The validated password from matchedData(req) gets hashed with bcrypt and salted the number of times that the .env-file specifies or 10 times.
	const hashed_password = await bcrypt.hash(
		validateData.password,
		Number(process.env.SALT_ROUNDS) || 10
	);
	debug("plaintext password:", validateData.password);
	debug("hashed password:", hashed_password);

	//Replaces validated password with hashed password and stores i variable "data" and then specifies the type, string, for "data" via CreateUser.
	const data = {
		...validateData,
		password: hashed_password,
	} as CreateUser;

	try {
		const user = await createUser(data);
		res.status(201).send({ status: "success", data: user });
	} catch (err) {
		debug("Error cant get user %0", err);
		return res
			.status(500)
			.send({ status: "error", message: "Could not create user in DB 🛑" });
	}
};
