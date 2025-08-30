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

export const gettingVendorStockSchema = z.object({
  search: z.string(),
  stockFilter: z.string(),
  pageIndex: z.number().min(0).default(0),
  pageSize: z.number().min(1).default(5),
});
