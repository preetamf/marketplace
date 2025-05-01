const mongoose = require('mongoose');
const slugify = require('slugify');

const bannerSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Please provide a title'],
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
			required: [true, 'Please provide an image URL'],
			trim: true,
		},
		mobileImageUrl: {
			type: String,
			trim: true,
		},
		link: {
			type: String,
			required: [true, 'Please provide a link'],
			trim: true,
			validate: {
				validator: function (v) {
					// Allow both absolute URLs and relative paths
					return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v) || /^\/[a-zA-Z0-9-_/]+$/.test(v);
				},
				message: 'Please provide a valid URL or relative path',
			},
		},
		position: {
			type: Number,
			required: [true, 'Please provide a position'],
			min: [1, 'Position must be at least 1'],
		},
		targetDevice: {
			type: String,
			enum: ['all', 'desktop', 'mobile'],
			default: 'all',
		},
		backgroundColor: {
			type: String,
			trim: true,
			default: '#FFFFFF',
		},
		textColor: {
			type: String,
			trim: true,
			default: '#000000',
		},
		buttonText: {
			type: String,
			trim: true,
			maxlength: [50, 'Button text cannot be more than 50 characters'],
		},
		buttonColor: {
			type: String,
			trim: true,
		},
		buttonTextColor: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'scheduled'],
			default: 'active',
		},
		startDate: {
			type: Date,
			default: Date.now,
		},
		endDate: {
			type: Date,
		},
		displayRules: {
			showOnHomepage: {
				type: Boolean,
				default: true,
			},
			showOnCategory: {
				type: Boolean,
				default: false,
			},
			showOnProduct: {
				type: Boolean,
				default: false,
			},
			showOnCart: {
				type: Boolean,
				default: false,
			},
			showOnCheckout: {
				type: Boolean,
				default: false,
			},
		},
		targetCategories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Category',
			},
		],
		targetProducts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		metaTitle: {
			type: String,
			trim: true,
			maxlength: [60, 'Meta title cannot be more than 60 characters'],
		},
		metaDescription: {
			type: String,
			trim: true,
			maxlength: [160, 'Meta description cannot be more than 160 characters'],
		},
		metaKeywords: [String],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Create slug from title
bannerSchema.pre('save', function (next) {
	this.slug = slugify(this.title, { lower: true });
	next();
});

// Add virtual for isActive
bannerSchema.virtual('isActive').get(function () {
	const now = new Date();
	return (
		this.status === 'active' &&
		(!this.startDate || this.startDate <= now) &&
		(!this.endDate || this.endDate >= now)
	);
});

// Add indexes
bannerSchema.index({ status: 1, startDate: 1, endDate: 1 });
bannerSchema.index({ position: 1 });
bannerSchema.index({ targetDevice: 1 });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner; 