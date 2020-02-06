const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('build', () => {
	return gulp.src('gulpfile.js', { read: false }).pipe(shell([ 'vue-cli-service build' ]));
});
