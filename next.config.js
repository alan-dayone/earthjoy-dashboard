/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
require('dotenv').config();

module.exports = {
  publicRuntimeConfig: {
    BASE_API_URL: process.env.BASE_API_URL,
  },
  compress: false, // Let Nginx or Apache do it.
  poweredByHeader: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
