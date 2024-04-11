import Debug from "debug";
import { Request } from "express";

const debug = Debug("Photo albums: auth.helper");

type AuthType = "Bearer";

export const extractAndValidateAuthHeader = (
	req: Request,
	expectedType: AuthType
) => {
	//1.
	if (!req.headers.authorization) {
		debug(
			"Your authorization is running around like a chicken without it's head! 🐔"
		);
		throw new Error(
			"Your authorization is running around like a chicken without it's head! 🐔"
		);
	}
	//2.
	const [authSchema, payload] = req.headers.authorization.split(" ");

	//3.
	if (authSchema !== expectedType) {
		debug("authorization schema not expected type %s", expectedType);
		throw new Error(`Expected type ${expectedType} authentication`);
	}

	return payload;
};
