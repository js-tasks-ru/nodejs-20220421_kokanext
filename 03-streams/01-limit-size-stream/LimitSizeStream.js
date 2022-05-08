const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.dataLength = 0;
  }

  _transform(chunk, encoding, callback) {
    let error = null;

    this.dataLength += Buffer.byteLength(Buffer.from(chunk));

    if (this.limit < this.dataLength) {
      error = new LimitExceededError();
    }

    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
