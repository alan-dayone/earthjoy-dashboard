/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
require('dotenv').config();

module.exports = {
  publicRuntimeConfig: {
    BASE_API_URL: process.env.BASE_API_URL,
  },
  compress: false, // Let Nginx or Apache do it.
  poweredByHeader: false,
};
