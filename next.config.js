const withTypescript = require('@zeit/next-typescript')
const withSass = require('@zeit/next-sass')

const config = withTypescript(
  withSass({
    cssLoaderOptions: {
      url: false
    }
  })
)

config.publicRuntimeConfig = {
  BASE_URL: process.env.BASE_URL
}

module.exports = config
