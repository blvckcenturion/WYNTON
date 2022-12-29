/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }
};

module.exports = nextConfig;
