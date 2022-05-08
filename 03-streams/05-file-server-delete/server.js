const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        break;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('Not found');
        break;
      }

      fs.rmSync(filepath);
      if (!fs.existsSync(filepath)) {
        res.statusCode = 200;
        res.end('OK');
      } else {
        res.statusCode = 500;
        res.end('Internal server error');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
