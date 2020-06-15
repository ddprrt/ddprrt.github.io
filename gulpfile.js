const { task, src, dest} = require('gulp')
const svg2png = require('svg2png')
const buffer = require('gulp-buffer')
const newy = require('gulp-newy')
const Vinyl = require('vinyl')
const path = require('path')
const Transform = require('stream').Transform;


function rename(filename) {
  return filename.replace(path.extname(filename), '.png');
}

const svgexec = (options = {}) => {
  const transformStream = new Transform({objectMode: true});

  transformStream._transform = (source, enc, cb) => {
    if (!source.isBuffer()) {
      return new Error('Streams are not supported by the underlying svg2png library.');
    }
    svg2png(source.contents, options)
      .then((contents) => {
        cb(null, new Vinyl({
          base: source.base,
          path: rename(source.path),
          contents
        }))
      })
      .catch((err) => {
        console.log(`Error while converting the image: ${source.path} ${err.message}`);
        cb(null, source)
      });
  }

  return transformStream
}


function checkPng(projectDir, srcFile, absSrc) {
  const p = absSrc.replace('.svg', '.png')
  console.log(p)
  return p
}

task('default', () => {
  return src('./dist/teasers/**.svg')
    .pipe(newy(checkPng))
    .pipe(svgexec())
    .pipe(dest('./dist/teasers'))
})
