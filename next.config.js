/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // allow product images from any HTTPS host (e.g. your S3/Cloudinary bucket)
    ],
  },
  async rewrites() {
    return [
      {
        // proxy /api/* to the Express backend so the browser only ever talks to one origin
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/:path*`,
      },
      {
        // proxy /uploads/* so locally-uploaded product images resolve through the same origin
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
