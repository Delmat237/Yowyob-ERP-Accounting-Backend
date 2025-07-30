import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
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
=======
  /* config options here */
};

export default nextConfig;
>>>>>>> a6fdc8676e0d50c0ff1989b81c72e5d10f93b908
