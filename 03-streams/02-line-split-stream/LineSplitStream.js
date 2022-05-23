const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let data;
    if (this.lastLine) {
      data = this.lastLine + chunk.toString();
    } else {
      data = chunk.toString();
    }

    const lines = data.split(os.EOL);

    this.lastLine = lines.splice(-1, 1)[0];

    lines.forEach((line) => {
      this.push(line);
    });
    callback();
  }

  _flush(callback) {
    if (this.lastLine) {
      this.push(this.lastLine);
    }
    callback();
  }
}

module.exports = LineSplitStream;
