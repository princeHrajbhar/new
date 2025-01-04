/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Use the protocol used by the external images
        hostname: "res.cloudinary.com", // Replace with the hostname of your image provider
        port: "", // Leave blank for default port
        pathname: "/**", // Allow all paths under this hostname
      },
    ],
  },
};

module.exports = nextConfig;
