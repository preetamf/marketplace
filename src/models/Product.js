const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Product name is required'],
			trim: true,
			maxlength: [100, 'Product name cannot be more than 100 characters'],
			minlength: [2, 'Product name must be at least 2 characters long'],
		},
		slug: {
			type: String,
		},
		sku: {
			type: String,
			required: [true, 'SKU is required'],
			match: [/^[A-Z0-9-]+$/, 'SKU must be uppercase alphanumeric with dashes'],
		},
		description: {
			type: String,
			required: [true, 'Product description is required'],
			trim: true,
			maxlength: [2000, 'Description cannot be more than 2000 characters'],
		},
		price: {
			type: Number,
			required: [true, 'Product price is required'],
			min: [0, 'Price cannot be negative'],
		},
		comparePrice: {
			type: Number,
			validate: {
				validator: function (v) {
					return v >= this.price;
				},
				message: 'Compare price must be greater than or equal to price',
			},
		},
		salePrice: {
			type: Number,
			validate: {
				validator: function (v) {
					return v <= this.price;
				},
				message: 'Sale price must be less than regular price',
			},
		},
		saleStart: Date,
		saleEnd: Date,
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
		images: [{
			url: String,
			alt: String,
			isDefault: Boolean,
		}],
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: [true, 'Product must belong to a category'],
		},
		subCategories: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		}],
		brand: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Brand',
		},
		tags: [{
			type: String,
			enum: ['trending', 'best-seller', 'new-arrival', 'sale', 'featured'],
		}],
		stock: {
			type: Number,
			required: [true, 'Stock quantity is required'],
			min: [0, 'Stock cannot be negative'],
		},
		weight: {
			type: Number,
			min: [0, 'Weight cannot be negative'],
		},
		dimensions: {
			height: { type: Number, min: 0 },
			width: { type: Number, min: 0 },
			length: { type: Number, min: 0 },
			unit: {
				type: String,
				enum: ['cm', 'inch'],
				default: 'cm',
			},
		},
		attributes: [{
			name: String,
			value: mongoose.Schema.Types.Mixed,
		}],
		variants: [{
			name: String,
			sku: String,
			price: Number,
			stock: Number,
			attributes: [{
				name: String,
				value: String,
			}],
		}],
		rating: {
			type: Number,
			default: 0,
			min: [0, 'Rating must be at least 0'],
			max: [5, 'Rating cannot be more than 5'],
		},
		ratingCount: {
			type: Number,
			default: 0,
		},
		reviews: [{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			rating: Number,
			comment: String,
			images: [String],
			createdAt: Date,
		}],
		status: {
			type: String,
			enum: ['active', 'inactive', 'out-of-stock', 'discontinued'],
			default: 'active',
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

// Create slug from name before saving
productSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// Indexes
productSchema.index({ name: 1 });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ subCategories: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ salePrice: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'dimensions.weight': 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
	if (!this.comparePrice) return 0;
	return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

// Virtual for sale status
productSchema.virtual('isOnSale').get(function () {
	const now = new Date();
	return (
		this.salePrice &&
		this.salePrice < this.price &&
		(!this.saleStart || now >= this.saleStart) &&
		(!this.saleEnd || now <= this.saleEnd)
	);
});

// Virtual for current price
productSchema.virtual('currentPrice').get(function () {
	return this.isOnSale ? this.salePrice : this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function () {
	if (this.stock <= 0) return 'out-of-stock';
	if (this.stock <= 10) return 'low-stock';
	return 'in-stock';
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 