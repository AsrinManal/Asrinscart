// utils/apifeautures.js

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;       // mongoose query (e.g. Product.find())
    this.queryStr = queryStr; // req.query
  }

  // Search by keyword in product name (case-insensitive)
  search() {
    if (this.queryStr.keyword) {
      const keyword = {
        name: { $regex: this.queryStr.keyword, $options: "i" },
      };
      this.query = this.query.find({ ...keyword });
    }
    return this;
  }

  // Filter by category, brand, price, ratings, and support gte/gt/lte/lt
  filter() {
    const queryCopy = { ...this.queryStr };

    // Fields to remove from filter processing
    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Convert query object to string and replace operators with $operators
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);

    // Make category and brand case-insensitive exact match
    if (parsedQuery.category) {
      parsedQuery.category = { $regex: `^${parsedQuery.category}$`, $options: "i" };
    }
    if (parsedQuery.brand) {
      parsedQuery.brand = { $regex: `^${parsedQuery.brand}$`, $options: "i" };
    }

    // Example support:
    // ?price[gte]=10000&price[lte]=50000  -> parsedQuery = { price: { $gte: 10000, $lte: 50000 } }

    this.query = this.query.find(parsedQuery);
    return this;
  }

  // Sorting: supports multiple options via query param `sort`
  // Examples: sort=price_low_high, price_high_low, rating_high_low, name_az, name_za
  sort() {
    if (this.queryStr.sort) {
      switch (this.queryStr.sort) {
        case "price_low_high":
          this.query = this.query.sort({ price: 1 });
          break;
        case "price_high_low":
          this.query = this.query.sort({ price: -1 });
          break;
        case "rating_high_low":
          this.query = this.query.sort({ ratings: -1 });
          break;
        case "name_az":
          this.query = this.query.sort({ name: 1 });
          break;
        case "name_za":
          this.query = this.query.sort({ name: -1 });
          break;
        default:
          // Support passing regular mongoose sort string as well (e.g. sort=price,-ratings)
          // Fallback: try to parse comma separated fields
          try {
            const raw = this.queryStr.sort;
            // convert friendly names to mongoose fields if you want, otherwise let user pass mongoose style
            // e.g. ?sort=createdAt -> works
            this.query = this.query.sort(raw.split(",").join(" "));
          } catch (err) {
            this.query = this.query.sort({ createdAt: -1 });
          }
      }
    } else {
      // Default sort: newest first
      this.query = this.query.sort({ createdAt: -1 });
    }
    return this;
  }

  // Pagination: resultPerPage (default) and page via req.query.page
  pagination(resultPerPage) {
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || resultPerPage;
    const skip = limit * (page - 1);

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
