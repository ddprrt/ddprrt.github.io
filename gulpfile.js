const { task, src, dest} = require('gulp')
const svg2png = require('gulp-svg2png')
const newy = require('gulp-newy')
const path = require('path')

function checkPng(projectDir, srcFile, absSrc) {
  const p = absSrc.replace('.svg', '.png')
  console.log(p)
  return p
}

task('default', () => {
  return src('./dist/teasers/**.svg')
    .pipe(newy(checkPng))
    .pipe(svg2png())
    .pipe(dest('./dist/teasers'))
})
