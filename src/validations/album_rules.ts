import { body } from "express-validator";

export const createAlbumRules = [
	body("title")
		.isString()
		.withMessage("Title must be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Must be at least 3 characters")
		.bail(),
];

export const updateAlbumRules = [
	body("title")
		.optional()
		.isString()
		.withMessage("Title must be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Must be at least 3 characters")
		.bail(),
];

//id integer required must be an existing photo id, kanske måste ligga i controller?

//id integer required must be an existing photos id, kanske måste ligga i controller?
