const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Banner title is required'],
			trim: true,
			maxlength: [100, 'Title cannot be more than 100 characters'],
		},
		subtitle: {
			type: String,
			trim: true,
			maxlength: [200, 'Subtitle cannot be more than 200 characters'],
		},
		description: {
			type: String,
			trim: true,
			maxlength: [500, 'Description cannot be more than 500 characters'],
		},
		imageUrl: {
			type: String,
			required: [true, 'Image URL is required'],
			validate: {
				validator: function (v) {
					return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
				},
				message: 'Please provide a valid image URL',
			},
		},
		mobileImageUrl: {
			type: String,
			validate: {
				validator: function (v) {
					return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
				},
				message: 'Please provide a valid image URL',
			},
		},
		link: {
			type: String,
			validate: {
				validator: function (v) {
					return /^https?:\/\/.+$/i.test(v);
				},
				message: 'Please provide a valid URL',
			},
		},
		position: {
			type: Number,
			required: [true, 'Banner position is required'],
			min: [1, 'Position must be at least 1'],
		},
		targetDevice: {
			type: String,
			enum: ['desktop', 'mobile', 'all'],
			default: 'all',
		},
		backgroundColor: {
			type: String,
			match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code'],
		},
		textColor: {
			type: String,
			match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code'],
		},
		buttonText: {
			type: String,
			trim: true,
			maxlength: [50, 'Button text cannot be more than 50 characters'],
		},
		buttonColor: {
			type: String,
			match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code'],
		},
		buttonTextColor: {
			type: String,
			match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code'],
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'scheduled', 'expired'],
			default: 'active',
		},
		startDate: {
			type: Date,
			default: Date.now,
		},
		endDate: {
			type: Date,
			validate: {
				validator: function (v) {
					return v > this.startDate;
				},
				message: 'End date must be after start date',
			},
		},
		displayRules: {
			showOnHomepage: { type: Boolean, default: true },
			showOnCategory: { type: Boolean, default: false },
			showOnProduct: { type: Boolean, default: false },
			showOnCart: { type: Boolean, default: false },
			showOnCheckout: { type: Boolean, default: false },
		},
		targetCategories: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		}],
		targetProducts: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		}],
		clicks: {
			type: Number,
			default: 0,
		},
		impressions: {
			type: Number,
			default: 0,
		},
		metaTitle: {
			type: String,
			maxlength: [60, 'Meta title cannot exceed 60 characters'],
		},
		metaDescription: {
			type: String,
			maxlength: [160, 'Meta description cannot exceed 160 characters'],
		},
		metaKeywords: [String],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		updatedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Indexes
bannerSchema.index({ position: 1 });
bannerSchema.index({ status: 1 });
bannerSchema.index({ startDate: 1 });
bannerSchema.index({ endDate: 1 });
bannerSchema.index({ targetDevice: 1 });
bannerSchema.index({ 'displayRules.showOnHomepage': 1 });
bannerSchema.index({ 'displayRules.showOnCategory': 1 });
bannerSchema.index({ 'displayRules.showOnProduct': 1 });
bannerSchema.index({ targetCategories: 1 });
bannerSchema.index({ targetProducts: 1 });

// Virtual for active status
bannerSchema.virtual('isActive').get(function () {
	const now = new Date();
	return (
		this.status === 'active' &&
		now >= this.startDate &&
		(!this.endDate || now <= this.endDate)
	);
});

// Virtual for click-through rate
bannerSchema.virtual('ctr').get(function () {
	if (this.impressions === 0) return 0;
	return (this.clicks / this.impressions) * 100;
});

// Virtual for remaining time
bannerSchema.virtual('remainingTime').get(function () {
	if (!this.endDate) return null;
	const now = new Date();
	const remaining = this.endDate - now;
	return remaining > 0 ? remaining : 0;
});

// Method to increment impressions
bannerSchema.methods.incrementImpressions = function () {
	this.impressions += 1;
	return this.save();
};

// Method to increment clicks
bannerSchema.methods.incrementClicks = function () {
	this.clicks += 1;
	return this.save();
};

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner; 