import Debug from "debug";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../types/token_types";
import { extractAndValidateAuthHeader } from "../../helpers/auth.helper";

declare module "express" {
	export interface Request {
		token?: JwtPayload;
	}
}

const debug = Debug("Photo albums:jwt");

export const validateAccessToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	debug("My name is auth, JWT auth 🔫");

	let token: string;

	try {
		token = extractAndValidateAuthHeader(req, "Bearer");
	} catch (err) {
		if (err instanceof Error) {
			return res
				.status(401)
				.send({ status: "fail", message: err.message });
		}
		return res
			.status(401)
			.send({ status: "fail", message: "Unknown authorization error" });
	}

	//Verify token and attach payload
	if (!process.env.ACCESS_TOKEN_SECRET) {
		debug("Access token MIA in .env");
		return res
			.status(500)
			.send({ status: "error", message: "Unknown authorization error" });
	}
	try {
		const payload = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET
		) as unknown as JwtPayload;

		req.token = payload;
	} catch (err) {
		debug("JWT Verify failed: %0", err);
		return res
			.status(401)
			.send({ status: "fail", message: "Authorization required 🚨" });
	}

	next();
};
