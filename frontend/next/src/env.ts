import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_ENDPOINT: z.string().url('Invalid API endpoint'),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string(),
    NEXT_PUBLIC_GA4_PROPERTY_ID: z.string().transform((val) => Number(val)),
    NEXT_PUBLIC_GA_SA_JSON: z.string(),
    NEXT_PUBLIC_ANALYTICS_CACHE_TTL: z.string().transform((val) => Number(val))
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_GA4_PROPERTY_ID: process.env.NEXT_PUBLIC_GA4_PROPERTY_ID,
    NEXT_PUBLIC_GA_SA_JSON: process.env.NEXT_PUBLIC_GA_SA_JSON,
    NEXT_PUBLIC_ANALYTICS_CACHE_TTL: process.env.NEXT_PUBLIC_ANALYTICS_CACHE_TTL
  },
  skipValidation: process.env.NODE_ENV !== 'production'
});
