/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, Document } from "mongoose";

const excludeField = ["searchTerm", "sort", "fields", "page", "limit"]

interface MetaData {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export class QueryBuilder<T extends Document> {
    private modelQuery: Query<T[], T>;
    private readonly query: Record<string, string>;
    private filterQuery: Record<string, any>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
        this.filterQuery = {}; // store actual query for meta calculation
    }

    // ---------------- Filter ----------------
    filter(): this {
        const filter = { ...this.query };
        for (const field of excludeField) { 
            delete filter[field];
        }
        this.filterQuery = filter; // save for meta count later
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }

    // ---------------- Search ----------------
    search(searchableFields: string[]): this {
        const searchTerm = this.query.searchTerm?.trim();
        if (searchTerm) {
            const searchQuery = {
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery);
            this.filterQuery = { ...this.filterQuery, ...searchQuery }; 
        }
        return this;
    }

    // ---------------- Sort ----------------
    sort(): this {
        const sortBy = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }

    // ---------------- Fields ----------------
    fields(): this {
        const fields = this.query.fields?.split(",").join(" ") || "";
        if (fields) {
            this.modelQuery = this.modelQuery.select(fields);
        }
        return this;
    }

    // ---------------- Pagination ----------------
    pagination(): this {
        const page = Math.max(Number(this.query.page) || 1, 1);
        const limit = Math.max(Number(this.query.limit) || 10, 1);
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    // ---------------- Build Query ----------------
    build(): Query<T[], T> {
        return this.modelQuery;
    }

    // ---------------- Get Meta ----------------
    async getMeta(): Promise<MetaData> {
        const page = Math.max(Number(this.query.page) || 1, 1);
        const limit = Math.max(Number(this.query.limit) || 10, 1);

        // Count only documents that match filter + search
        const totalDocument = await this.modelQuery.model.countDocuments(
            this.filterQuery
        );

        const totalPage = Math.ceil(totalDocument / limit);

        return {
            page,
            limit,
            total: totalDocument,
            totalPage,
        };
    }
}
