const Joi = require('joi');
const AppError = require('../utils/AppError');

const validateRequest = (schema) => {
	return (req, res, next) => {
		const { error } = schema.validate(req.query, {
			abortEarly: false,
			allowUnknown: true,
		});

		if (error) {
			const errorMessage = error.details
				.map((detail) => detail.message)
				.join(', ');
			return next(new AppError(errorMessage, 400));
		}

		next();
	};
};

const productQuerySchema = Joi.object({
	page: Joi.number().integer().min(1),
	limit: Joi.number().integer().min(1).max(100),
	sort: Joi.string().valid('price', '-price', 'rating', '-rating', 'createdAt', '-createdAt'),
	minPrice: Joi.number().min(0),
	maxPrice: Joi.number().min(0),
	rating: Joi.number().min(0).max(5),
	tags: Joi.array().items(Joi.string()),
	category: Joi.string(),
	search: Joi.string(),
});

module.exports = {
	validateRequest,
	productQuerySchema,
}; 