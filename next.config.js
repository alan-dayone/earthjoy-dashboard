const environmentVariables = require('dotenv').config().parsed;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withSass = require('@zeit/next-sass');

const config = withSass();

config.env = environmentVariables;

module.exports = config;
