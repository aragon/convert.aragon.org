const path = require('path')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')

module.exports = withCSS(
  withImages({
    webpack(config, options) {
      return ['lib', 'components'].reduce((config, dirname) => {
        config.resolve.alias[dirname] = path.join(__dirname, dirname)
        return config
      }, config)
    },
  })
)
