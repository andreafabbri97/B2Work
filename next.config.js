/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/B2Work',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
