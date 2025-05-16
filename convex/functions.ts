import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { branchSchema, categorySchema, productSchema } from "./schema";

////////////////////////////////////////////////////////////
// Categories
////////////////////////////////////////////////////////////
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getActiveCategories = query({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    return data;
  },
});

export const addCategory = mutation({
  args: categorySchema,
  async handler(ctx, args) {
    await ctx.db.insert("categories", { ...args });
  },
});

export const updateCategory = mutation({
  args: { id: v.id("categories"), ...categorySchema },
  async handler(ctx, args) {
    const updated = { ...args };
    delete (updated as { id?: string }).id;

    await ctx.db.patch(args.id, { ...updated });
  },
});

export const removeCategory = mutation({
  args: { id: v.id("categories") },
  async handler(ctx, args) {
    await ctx.db.delete(args.id);
  },
});

export const activateCategory = mutation({
  args: { id: v.id("categories") },
  async handler(ctx, args) {
    await ctx.db.patch(args.id, {
      active: true,
    });
  },
});

export const deActivateCategory = mutation({
  args: { id: v.id("categories") },
  async handler(ctx, args) {
    await ctx.db.patch(args.id, {
      active: false,
    });
  },
});

////////////////////////////////////////////////////////////
// Products
////////////////////////////////////////////////////////////
export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const addProduct = mutation({
  args: productSchema,
  async handler(ctx, args) {
    await ctx.db.insert("products", { ...args });
  },
});

export const updateProduct = mutation({
  args: { id: v.id("products"), ...productSchema },
  async handler(ctx, args) {
    const updated = { ...args };
    delete (updated as { id?: string }).id;

    await ctx.db.patch(args.id, { ...updated });
  },
});

export const removeProduct = mutation({
  args: { id: v.id("products") },
  async handler(ctx, args) {
    await ctx.db.delete(args.id);
  },
});

export const activateProduct = mutation({
  args: { id: v.id("products") },
  async handler(ctx, args) {
    await ctx.db.patch(args.id, { active: true });
  },
});

export const deActivateProduct = mutation({
  args: { id: v.id("products") },
  async handler(ctx, args) {
    await ctx.db.patch(args.id, { active: false });
  },
});

export const getProductByCategoryId = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("categoryId"), args.id))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

export const getActiveProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

////////////////////////////////////////////////////////////
// Branches
////////////////////////////////////////////////////////////
export const getBranches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("branches").collect();
  },
});

export const getActiveBranches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("branches")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

export const addBranch = mutation({
  args: branchSchema,
  async handler(ctx, args) {
    await ctx.db.insert("branches", { ...args });
  },
});

export const updateBranch = mutation({
  args: { id: v.id("branches"), ...branchSchema },
  async handler(ctx, args) {
    const updated = { ...args };
    delete (updated as { id?: string }).id;

    await ctx.db.patch(args.id, { ...updated });
  },
});

export const removeBranch = mutation({
  args: { id: v.id("branches") },
  async handler(ctx, args) {
    await ctx.db.delete(args.id);
  },
});

export const activateBranch = mutation({
  args: { id: v.id("branches") },
  async handler(ctx, args) {
    await ctx.db.patch(args.id, { active: true });
  },
});

export const deActivateBranch = mutation({
  args: { id: v.id("branches") },
  async handler(ctx, args) {
    await ctx.db.patch(args.id, { active: false });
  },
});

////////////////////////////////////////////////////////////
// Uploads
////////////////////////////////////////////////////////////
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
