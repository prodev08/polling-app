module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      console.log('Running on the server')
    }
    return config
  },
}
