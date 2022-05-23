const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        break;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already exists');
        break;
      }

      const file = fs.createWriteStream(filepath);
      const limitStream = new LimitSizeStream({limit: 1024 * 1024});
      req.pipe(limitStream).pipe(file);

      file.on('finish', () => {
        res.statusCode = 201;
        res.end('File created');
      });

      limitStream.on('error', (err) => {
        if (err instanceof LimitExceededError) {
          fs.rmSync(filepath);

          res.statusCode = 413;
          res.end('File is too large');
        } else {
          res.statusCode = 500;
          res.end(err.message);
        }
      });

      file.on('error', (err) => {
        res.statusCode = 500;
        res.end(err.message);
      });

      req.on('aborted', () => {
        file.destroy();
        fs.rmSync(filepath);
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
