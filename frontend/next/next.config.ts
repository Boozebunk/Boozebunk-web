import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Only load pictures from these approved websites for next/image optimization and loading..
  images: {
    domains: [
      'via.placeholder.com'
      // aws s3 bucket name || or any image storing platform link (eg: Cloudinary, Imgix, etc.)
    ]
  }
};

export default nextConfig;
