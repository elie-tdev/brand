module.exports = {
  service: {
    endpoint: {
      url: 'http://localhost:9000/graphql',
      headers: {
        // optional
        authorization: 'Bearer test',
      },
      skipSSLValidation: true,
    },
    includes: ['**/*.graphql'],
  },
}
