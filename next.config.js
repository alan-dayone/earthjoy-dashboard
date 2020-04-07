// eslint-disable-next-line no-undef
const environmentVariables = require('dotenv').config().parsed;

const withSass = require('@zeit/next-sass');
const config = withSass();

config.env = environmentVariables;

module.exports = config;
