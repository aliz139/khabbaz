import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const categorySchema = {
  name: v.string(),
  sortOrder: v.optional(v.number()),
  active: v.boolean(),
};

export const productSchema = {
  categoryId: v.id("categories"),
  name: v.string(),
  description: v.string(),
  price: v.number(),
  image: v.string(),
  active: v.boolean(),
  sortOrder: v.optional(v.number()),
  sizes: v.array(
    v.object({
      size: v.string(),
      price: v.number(),
    })
  ),
};

export const branchSchema = {
  name: v.string(),
  address: v.string(),
  phone: v.string(),
  sortOrder: v.optional(v.number()),
  active: v.boolean(),
};

export default defineSchema({
  categories: defineTable(categorySchema),
  products: defineTable(productSchema).index("categoryId", ["categoryId"]),
  branches: defineTable(branchSchema),
});
