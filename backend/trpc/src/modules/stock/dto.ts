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

export const bulkUploadStockSchema = z.array(
  z.tuple([
    z.string().min(1, "Brand Name is required."),
    z.string().min(1, "Product Name is required."),
    z.string().min(1, "Category is required."),
    z.string().optional(),
    z.string().min(1, "Size is required."),
    z.string().min(1, "Price is required."),
  ]),
);

export const stockEditSchema = z.object({
  stockId: z.string(),
  brandName: z.string().optional(),
  productName: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  size: z.string().optional(),
  price: z.string().optional(),
});

export type StockEditTypes = z.infer<typeof stockEditSchema>;

export type BulkUploadStockType = z.infer<typeof bulkUploadStockSchema>;
