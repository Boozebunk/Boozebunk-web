import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_ENDPOINT: z.string().url('Invalid API endpoint'),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string()
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  },
  skipValidation: process.env.NODE_ENV !== 'production'
});
