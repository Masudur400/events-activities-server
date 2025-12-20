"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const excludeField = ["searchTerm", "sort", "fields", "page", "limit"];
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
        this.filterQuery = {}; // store actual query for meta calculation
    }
    // ---------------- Filter ----------------
    filter() {
        const filter = Object.assign({}, this.query);
        for (const field of excludeField) {
            delete filter[field];
        }
        this.filterQuery = filter; // save for meta count later
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    // ---------------- Search ----------------
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this.query.searchTerm) === null || _a === void 0 ? void 0 : _a.trim();
        if (searchTerm) {
            const searchQuery = {
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery);
            this.filterQuery = Object.assign(Object.assign({}, this.filterQuery), searchQuery);
        }
        return this;
    }
    // ---------------- Sort ----------------
    sort() {
        const sortBy = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }
    // ---------------- Fields ----------------
    fields() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
        if (fields) {
            this.modelQuery = this.modelQuery.select(fields);
        }
        return this;
    }
    // ---------------- Pagination ----------------
    pagination() {
        const page = Math.max(Number(this.query.page) || 1, 1);
        const limit = Math.max(Number(this.query.limit) || 10, 1);
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    // ---------------- Build Query ----------------
    build() {
        return this.modelQuery;
    }
    // ---------------- Get Meta ----------------
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Math.max(Number(this.query.page) || 1, 1);
            const limit = Math.max(Number(this.query.limit) || 10, 1);
            // Count only documents that match filter + search
            const totalDocument = yield this.modelQuery.model.countDocuments(this.filterQuery);
            const totalPage = Math.ceil(totalDocument / limit);
            return {
                page,
                limit,
                total: totalDocument,
                totalPage,
            };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
