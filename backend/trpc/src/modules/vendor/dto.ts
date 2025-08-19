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

export type GooglePlacesResponse = z.infer<typeof googlePlacesResponseSchema>;

export type VendorRegistration = z.infer<typeof vendorRegistrationSchema>;
