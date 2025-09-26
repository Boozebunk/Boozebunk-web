import z from "zod";

export const vendorInfoSchema = z.object({
  id: z.string(),
  martName: z.string(),
  distanceMeters: z.number(),
  storeStatus: z.string(),
});

export type SearchedStock = {
  stockId: string;
  vendorName: string | null;
  brand: string;
  productName: string;
  price: string;
};

export type VendorInfo = z.infer<typeof vendorInfoSchema>[];
