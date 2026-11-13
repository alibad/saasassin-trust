import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This repository serves SaaSassin Trust at the root of every host (src/proxy.ts).
  // Inlined at build time, so a fresh deployment works without setting STANDALONE_PRODUCT.
  env: { STANDALONE_PRODUCT: process.env.STANDALONE_PRODUCT || "trust" },
  // Next externalizes firebase-admin by default, but Admin 14's auth package
  // contains an ESM-only JOSE dependency. Bundling it avoids a CommonJS require
  // at runtime in Vercel's serverless functions.
  transpilePackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "developers.google.com",
        pathname: "/static/identity/images/g-logo.png",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.saasassin.net" }],
        destination: "https://saasassin.net/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
