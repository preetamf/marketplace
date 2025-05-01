const Banner = require('../models/Banner');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllBanners = catchAsync(async (req, res, next) => {
	const now = new Date();
	const banners = await Banner.find({
		status: 'active',
		startDate: { $lte: now },
		$or: [{ endDate: { $gt: now } }, { endDate: null }],
	})
		.select('title subtitle description imageUrl mobileImageUrl link position targetDevice backgroundColor textColor buttonText buttonColor buttonTextColor')
		.sort({ position: 1 });

	if (!banners || banners.length === 0) {
		return next(new AppError('No active banners found', 404));
	}

	res.status(200).json({
		status: 'success',
		results: banners.length,
		data: {
			banners,
		},
	});
}); 