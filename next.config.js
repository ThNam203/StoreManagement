/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["i.pravatar.cc", "cstores.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
