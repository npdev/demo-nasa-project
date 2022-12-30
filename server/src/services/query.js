function getPagination(query) {
    // Math.abs for getting number from string as well
    const page = query.page ? Math.abs(query.page) : 1;
    const limit = query.limit ? Math.abs(query.limit) : 0;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    };
}

module.exports = {
    getPagination
}
