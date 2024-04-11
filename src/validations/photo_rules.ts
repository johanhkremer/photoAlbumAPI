import { body } from "express-validator";

export const createPhotoRules = [
	body("title")
		.isString()
		.withMessage("Title must be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Minimum of 3 tecken you cheap bastard! 🐑")
		.bail(),

	body("url")
		.isString()
		.withMessage("URL must be a string")
		.bail(),
	body("comment")
		.isString()
		.withMessage("Comment must be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Minimum of 3 tecken you cheap bastard! 🐑")
		.bail(),
];

export const updatePhotoRules = [
	body("title")
		.optional()
		.isString()
		.withMessage("Title must be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Minimum of 3 tecken you cheap bastard! 🐑")
		.bail(),
	body("url")
		.isString()
		.withMessage("URL must be a string")
		.bail()
		.isURL()
		.withMessage("URL must be a URL")
		.bail(),
	body("comment")
		.isString()
		.withMessage("Comment must be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Minimum of 3 tecken you cheap bastard! 🐑")
		.bail(),
	body("url")
		.optional()
		.isString()
		.withMessage("URL must be a string")
		.bail(),
	body("comment")
		.optional()
		.isString()
		.withMessage("Comment must be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Minimum of 3 tecken you cheap bastard!")
		.bail(),
	body("userId")
		.optional({ checkFalsy: true })
		.isNumeric()
		.withMessage("User must be a number"),
];
