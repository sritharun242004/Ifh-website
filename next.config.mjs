/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/why-ifh", destination: "/legacy#why-ifh", permanent: false }];
  },
};

export default nextConfig;
