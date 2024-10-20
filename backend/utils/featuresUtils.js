class FeaturesUtils {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            },
        } : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        const removeFields = ["keyword", "page", "limit", "from", "to", "date"];
        removeFields.forEach(key => delete queryCopy[key]);

        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    filterByStoppagesAndDate() {
        const { from, to, date } = this.queryStr;
    
        // Build the query conditions dynamically
        const conditions = {};
    
        // Check if 'date' is provided, if yes, add it to the query conditions
        if (date) {
            conditions.journeyDate = new Date(date);
        }
    
        // Handle stoppages conditions
        if (from || to) {
            conditions.stoppages = { $all: [] }; // Initialize stoppages array
    
            // Add 'from' condition if provided
            if (from) {
                conditions.stoppages.$all.push({
                    $elemMatch: { location: { $regex: from, $options: "i" } } // Case-insensitive
                });
            }
    
            // Add 'to' condition if provided
            if (to) {
                conditions.stoppages.$all.push({
                    $elemMatch: { location: { $regex: to, $options: "i" } } // Case-insensitive
                });
            }
    
            // If neither 'from' nor 'to' is provided, remove stoppages from the conditions
            if (conditions.stoppages.$all.length === 0) {
                delete conditions.stoppages;
            }
        }
    
        // Apply the dynamically built query conditions if any
        if (Object.keys(conditions).length > 0) {
            this.query = this.query.find(conditions);
        }
    
        return this;
    }
    

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = FeaturesUtils;
