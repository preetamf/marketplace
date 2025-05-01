const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const getPaginationParams = (req) => {
	const page = Math.abs(parseInt(req.query.page, 10)) || DEFAULT_PAGE;
	const limit = Math.min(Math.abs(parseInt(req.query.limit, 10)) || DEFAULT_LIMIT, MAX_LIMIT);
	const skip = (page - 1) * limit;

	return { page, limit, skip };
};

const getPaginationResponse = (total, page, limit) => {
	const totalPages = Math.ceil(total / limit);
	const hasNextPage = page < totalPages;
	const hasPrevPage = page > 1;

	return {
		total,
		totalPages,
		currentPage: page,
		hasNextPage,
		hasPrevPage,
		nextPage: hasNextPage ? page + 1 : null,
		prevPage: hasPrevPage ? page - 1 : null,
	};
};

module.exports = {
	getPaginationParams,
	getPaginationResponse,
}; 