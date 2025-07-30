import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: false,  // Désactiver Turbopack
  },
  swcMinify: true,  // Forcer l'utilisation de SWC pour la minification
};

// export default nextConfig;
// module.exports = {
//   experimental: {
//     turbo: false,  // Désactiver Turbopack
//   },
//   swcMinify: true,  // Forcer l'utilisation de SWC pour la minification
// }
export const config = {
  experimental: {
    turbo: false,  // Désactiver Turbopack
  },
  swcMinify: true,  // Forcer l'utilisation de SWC pour la minification
};
export default nextConfig;