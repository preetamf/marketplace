const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Category name is required'],
			trim: true,
			maxlength: [50, 'Category name cannot be more than 50 characters'],
			minlength: [2, 'Category name must be at least 2 characters long'],
		},
		slug: {
			type: String,
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
		// Hierarchical structure
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			validate: {
				validator: function (v) {
					if (!v) return true; // Allow null/undefined
					return v.toString() !== this._id.toString();
				},
				message: 'Category cannot be its own parent',
			},
		},
		path: {
			type: String,
		},
		level: {
			type: Number,
			default: 0,
		},
		// SEO fields
		metaTitle: {
			type: String,
			maxlength: [60, 'Meta title cannot exceed 60 characters'],
		},
		metaDescription: {
			type: String,
			maxlength: [160, 'Meta description cannot exceed 160 characters'],
		},
		metaKeywords: [String],
		// Additional fields
		icon: {
			type: String,
			validate: {
				validator: function (v) {
					return /^[a-z0-9-]+$/.test(v);
				},
				message: 'Icon must be a valid icon name',
			},
		},
		attributes: [{
			name: String,
			type: {
				type: String,
				enum: ['text', 'number', 'boolean', 'select', 'multiselect'],
			},
			options: [String],
			required: Boolean,
		}],
		isFeatured: {
			type: Boolean,
			default: false,
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'archived'],
			default: 'active',
		},
		order: {
			type: Number,
			default: 0,
		},
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
categorySchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// Update path and level when parent changes
categorySchema.pre('save', async function (next) {
	if (this.isModified('parent')) {
		if (this.parent) {
			const parent = await this.constructor.findById(this.parent);
			if (parent) {
				this.level = parent.level + 1;
				this.path = parent.path ? `${parent.path}/${this.slug}` : this.slug;
			}
		} else {
			this.level = 0;
			this.path = this.slug;
		}
	}
	next();
});

// Indexes
categorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ status: 1 });
categorySchema.index({ order: 1 });

// Virtual for product count
categorySchema.virtual('productCount', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'category',
	count: true,
});

// Virtual for children
categorySchema.virtual('children', {
	ref: 'Category',
	localField: '_id',
	foreignField: 'parent',
});

// Virtual for ancestors
categorySchema.virtual('ancestors', {
	ref: 'Category',
	localField: 'path',
	foreignField: 'path',
	match: { _id: { $ne: this._id } },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 