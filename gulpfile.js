const { task, src, dest} = require('gulp')
const svg2png = require('gulp-svg2png')

task('default', () => {
  return src('./dist/teasers/**.svg')
    .pipe(svg2png())
    .pipe(dest('./dist/teasers'))
})
