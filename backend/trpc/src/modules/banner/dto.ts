import z from "zod";

export const createBannerSchema = z.object({
  imageUrl: z.string().url("Invalid image URL."),
  fileKey: z.string().min(1, "File key is required for deletion."),
  websiteUrl: z.string().url("Invalid website URL format.").optional().or(z.literal("")),
});

export const deleteBannerSchema = z.object({
  id: z.string().uuid("Invalid banner ID."),
});
