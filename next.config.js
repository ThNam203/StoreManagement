/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["i.pravatar.cc", "cstores.s3.amazonaws.com"],
  },
  webpack: (config) => {
    config.resolve.alias.canvas= false;
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    },)
    return config;
  }
};

module.exports = nextConfig;
