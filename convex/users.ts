import { query } from "./_generated/server";

export const getAllUsers = query({
    args: {},
    handler: async (ctx) => {
        console.log("Fetching all users");
        return await ctx.db.query("users").collect();
    }
})
