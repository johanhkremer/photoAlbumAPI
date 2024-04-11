import { body } from "express-validator";
import { getUserByEmail } from "../services/profile_service";

export const loginRules = [
	body("email")
		.isEmail()
		.withMessage("Must be an email")
		.bail()
		.custom(async (email) => {
			const user = await getUserByEmail(email);
			if (!user) {
				return Promise.reject("User does not exist");
			}
		})
		.bail(),
	body("password")
		.trim()
		.isLength({ min: 6 })
		.withMessage("Password must be atleast 6 characters long")
		.bail(),
];

export const registerRules = [
	body("email")
		.isEmail()
		.withMessage("Must be an email")
		.bail()
		.custom(async (email) => {
			const user = await getUserByEmail(email);
			if (user) {
				return Promise.reject("Email already in use");
			}
		})
		.bail(),

	body("password")
		.isString()
		.withMessage("Must be a string")
		.bail()
		.trim()
		.isLength({ min: 6 })
		.withMessage("Password must be atleast 6 characters long")
		.bail(),

	body("first_name")
		.isString()
		.withMessage("Must be a string")
		.bail()
		.isLength({ min: 3 })
		.withMessage("First name must be atleast 3 characters long")
		.bail(),

	body("last_name")
		.isString()
		.withMessage("Must be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Last name must be atleast 3 characters long")
		.bail(),
];

export const updateUserRules = [
	body("email")
		.optional()
		.isEmail()
		.withMessage("Must be an email")
		.bail(),

	body("password")
		.optional()
		.trim()
		.isLength({ min: 6 })
		.withMessage("Password must be atleast 6 characters long")
		.bail(),

	body("first_name")
		.optional()
		.isString()
		.trim()
		.withMessage("Must be a string")
		.bail()
		.isLength({ min: 3 })
		.withMessage("First name must be atleast 3 characters long")
		.bail(),

	body("last_name")
		.optional()
		.isString()
		.trim()
		.withMessage("Must be a string")
		.bail()
		.isLength({ min: 3 })
		.withMessage("Last name must be atleast 3 characters long")
		.bail(),
];
