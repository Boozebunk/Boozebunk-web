import db from "@boozebunk-trpc/db";
import { BlogsTable } from "@boozebunk-trpc/db/schema/blogs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import z from "zod";

export const blogRouter = createTRPCRouter({
  createBlog: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        tag: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied." });
      }

      try {
        await db.insert(BlogsTable).values({
          title: input.title,
          description: input.description,
          tag: input.tag,
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create blog post ${err}`,
        });
      }
    }),

  getAllBlogs: publicProcedure.query(async () => {
    try {
      const blogs = await db.select().from(BlogsTable).orderBy(desc(BlogsTable.createdAt));

      return {
        success: true,
        blogs,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch blog posts ${err}`,
      });
    }
  }),

  editBlog: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        tag: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied." });
      }
      try {
        await db
          .update(BlogsTable)
          .set({
            title: input.title,
            description: input.description,
            tag: input.tag,
          })
          .where(eq(BlogsTable.id, input.id));

        return { success: true };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to edit blog post ${err}`,
        });
      }
    }),

  deleteBlog: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied." });
      }
      try {
        await db.delete(BlogsTable).where(eq(BlogsTable.id, input.id));

        return { success: true };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete blog post ${err}`,
        });
      }
    }),
});
