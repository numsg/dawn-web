const gulp = require('gulp');
const options = require('../gulp-config');
const { docker } = require('./foal-docker');

gulp.task('docker', ['tar'], () => {
  docker(options.version);
});