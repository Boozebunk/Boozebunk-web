import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Only load pictures from these approved websites for next/image optimization and loading..
  images: {
    domains: [
      'via.placeholder.com',
      'bb-vendor-stock-images.s3.ap-south-1.amazonaws.com'
      // aws s3 bucket name || or any image storing platform link (eg: Cloudinary, Imgix, etc.  )
    ]
  }
};

export default nextConfig;
