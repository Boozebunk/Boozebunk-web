import z from "zod";

export const vendorInfoSchema = z.object({
  id: z.string(),
  martName: z.string(),
  distanceMeters: z.number(),
  storeStatus: z.string(),
  martLat: z.number(),
  martLng: z.number(),
  martArea: z.string().optional(),
  martCity: z.string().optional(),
  martState: z.string().optional(),
  martPostalCode: z.string().optional(),
  martOpenTime: z.string(),
  martCloseTime: z.string(),
});

export type SearchedStock = {
  stockId: string;
  vendorName: string | null;
  brand: string;
  productName: string;
  price: string;
};

export const stockDisplaySchema = z.object({
  city: z.string(),
  category: z.string().optional(),
  pageIndex: z.number(),
  pageSize: z.number(),
});

export type VendorInfo = {
  id: string;
  martName: string;
  storeStatus: string;
  martOpenTime: string;
  martCloseTime: string;
  martArea: string | null;
  martCity: string | null;
  martState: string | null;
  martPostalCode: string | null;
  martLat: number;
  martLng: number;
  distanceMeters: number;
}[];
