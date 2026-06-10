import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { quizLanguage } from "./schema";
import { normalizePhone } from "./phone";

export const register = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    language: quizLanguage,
  },
  handler: async (ctx, args) => {
    const phone = args.phone.trim();

    return await ctx.db.insert("participants", {
      name: args.name.trim(),
      phone,
      phoneNormalized: normalizePhone(phone),
      language: args.language,
      startedAt: Date.now(),
    });
  },
});

export const get = query({
  args: { id: v.id("participants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const participants = await ctx.db.query("participants").collect();
    return participants.sort((a, b) => b.startedAt - a.startedAt);
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const participants = await ctx.db.query("participants").collect();
    return participants.length;
  },
});
