const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getFeaturedCategories = catchAsync(async (req, res, next) => {
	const categories = await Category.find({ isFeatured: true })
		.select('name description imageUrl icon order')
		.sort({ order: 1 });

	if (!categories || categories.length === 0) {
		return next(new AppError('No featured categories found', 404));
	}

	res.status(200).json({
		status: 'success',
		results: categories.length,
		data: {
			categories,
		},
	});
}); 