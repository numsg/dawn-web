const gulp = require('gulp');
const sonarqubeScanner = require('sonarqube-scanner');
const options = require('../gulp-config');

gulp.task('sonar', function (callback) {
  process.env.SONAR_SCANNER_MIRROR = 'http://172.22.24.51:8081/nexus/content/sites/gs-assets/sonar-scanner/';
  sonarqubeScanner({
    serverUrl: options.sonarOptions.host.url,
    token: options.sonarOptions.token,
    options: options.sonarOptions.options
  }, callback);
});

// gulp.task('sonar', () => {
// 	const option = {
// 		sonar: {
// 			host: options.sonarOptions.host,
//       token: options.sonarOptions.token,
// 			projectKey: options.name,
// 			projectName: options.name,
// 			projectVersion: options.version,
// 			sources: 'src',
// 			test: 'tests',
// 			language: 'ts',
// 			sourceEncoding: 'UTF-8',
// 			ts: {
// 				tslintpath: 'node_modules/tslint/bin/tslint',
// 				tslintconfigpath: 'tslint.json',
// 				lcov: {
// 					reportpath: 'coverage/lcov.info'
// 				}
// 			},
// 			exec: {
// 				maxBuffer: 1024 * 1024
// 			}
// 		}
// 	};

// 	return gulp.src('gulpfile.js', { read: false }).pipe(sonar(option));
// });