/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const environmentVariables = require('dotenv').config().parsed;

module.exports = {
  env: environmentVariables,
};
