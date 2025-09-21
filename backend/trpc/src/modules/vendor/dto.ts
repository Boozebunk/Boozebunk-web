import { z } from "zod";

export const vendorRegistrationSchema = z.object({
  martName: z.string(),
  licenseNumber: z.string(),
  vendorName: z.string(),
  email: z.email(),
  phoneNumber: z.string(),
  addressFormatted: z.string(),
  addressArea: z.string(),
  addressPostalCode: z.string().optional(),
  addressCity: z.string(),
  addressState: z.string(),
  locationCoordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .refine((coords) => coords.lat !== undefined && coords.lng !== undefined, {
      message: "Location coordinates are required. Please select a valid mart from suggestions.",
    }),
});

export const googlePlacesResponseSchema = z.object({
  displayName: z.string(),
  formattedAddress: z.string(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export const gettingVendorInputSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().default(true),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  pageIndex: z.number().min(0).default(0),
  pageSize: z.number().min(1).default(5),
});

export const editVendorSchema = z.object({
  vendorId: z.string(),
  martName: z.string().optional(),
  licenseNumber: z.string().optional(),
  vendorName: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export type EditVendorTypes = z.infer<typeof editVendorSchema>;

export type GooglePlacesResponse = z.infer<typeof googlePlacesResponseSchema>;

export type VendorRegistration = z.infer<typeof vendorRegistrationSchema>;
