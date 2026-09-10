/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  output: 'standalone',
  serverExternalPackages: ['@node-rs/argon2']
};
export default nextConfig;
