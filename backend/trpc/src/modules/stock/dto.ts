import z from "zod";

export const vendorAddStockSchema = z.object({
  productName: z.string(),
  brand: z.string(),
  category: z.string(),
  type: z.string().optional(),
  size: z.string(),
  price: z.string(),
  availability: z.boolean().default(true),
});
