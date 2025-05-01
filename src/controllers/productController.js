const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { getPaginationParams, getPaginationResponse } = require('../utils/pagination');

const buildProductQuery = (query) => {
	const filter = {};

	// Price range filter
	if (query.minPrice || query.maxPrice) {
		filter.price = {};
		if (query.minPrice) filter.price.$gte = query.minPrice;
		if (query.maxPrice) filter.price.$lte = query.maxPrice;
	}

	// Rating filter
	if (query.rating) {
		filter.rating = { $gte: query.rating };
	}

	// Tags filter
	if (query.tags) {
		filter.tags = { $in: query.tags };
	}

	// Category filter
	if (query.category) {
		filter.category = query.category;
	}

	// Search filter
	if (query.search) {
		filter.$or = [
			{ name: { $regex: query.search, $options: 'i' } },
			{ description: { $regex: query.search, $options: 'i' } },
		];
	}

	return filter;
};

const getSortOptions = (sort) => {
	const sortOptions = {
		price: { price: 1 },
		'-price': { price: -1 },
		rating: { rating: 1 },
		'-rating': { rating: -1 },
		createdAt: { createdAt: 1 },
		'-createdAt': { createdAt: -1 },
	};

	return sortOptions[sort] || { rating: -1, ratingCount: -1 };
};

exports.getProductsByTag = catchAsync(async (req, res, next) => {
	const { page, limit, skip } = getPaginationParams(req);
	const sort = getSortOptions(req.query.sort);

	const filter = buildProductQuery(req.query);
	filter.tags = req.params.tag;

	const [products, total] = await Promise.all([
		Product.find(filter)
			.select('name description price comparePrice imageUrl images rating ratingCount tags')
			.sort(sort)
			.skip(skip)
			.limit(limit),
		Product.countDocuments(filter),
	]);

	if (!products || products.length === 0) {
		return next(new AppError(`No ${req.params.tag} products found`, 404));
	}

	res.status(200).json({
		status: 'success',
		pagination: getPaginationResponse(total, page, limit),
		data: {
			products,
		},
	});
});

exports.getTrendingProducts = catchAsync(async (req, res, next) => {
	req.params.tag = 'trending';
	return exports.getProductsByTag(req, res, next);
});

exports.getBestSellingProducts = catchAsync(async (req, res, next) => {
	req.params.tag = 'best-seller';
	return exports.getProductsByTag(req, res, next);
}); 