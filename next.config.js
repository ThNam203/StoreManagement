/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["i.pravatar.cc", "cstores.s3.amazonaws.com"],
  },
  webpack: (config) => {
    config.resolve.alias.canvas= false;
    return config;
  }
};

module.exports = nextConfig;
