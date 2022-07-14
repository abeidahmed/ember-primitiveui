const FastBootAppServer = require('fastboot-app-server');

const server = new FastBootAppServer({
  distPath: 'dist',
  gzip: true, // Optional - Enables gzip compression.
  host: '0.0.0.0',
  log: true, // Optional - Specifies whether the server should use its default request logging. Useful for turning off default logging when providing custom logging middlewares
});

server.start();
