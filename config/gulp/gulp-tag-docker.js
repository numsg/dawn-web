
const gulp = require('gulp');
const git = require('gulp-git');
const minimist = require('minimist');
const { docker } = require('./foal-docker');

gulp.task('tag-docker', ['tar'], () => {
  const knownOptions = {
    default: {
      env: process.env.NODE_ENV || 'production',
      ver: ''
    }
  };
  const commandOpts = minimist(process.argv.slice(2), knownOptions);
  if (commandOpts.ver) {
    docker(commandOpts.ver);
  } else {
    git.exec({ args: 'rev-list --tags --max-count=1' }, (error, stdout) => {
      console.log('---rev-list---');
      console.log(stdout);
      git.exec({ args: `describe --tags ${stdout}` }, (err, tagName) => {
        console.log('---tag-name---');
        console.log(tagName);
        const version = tagName.replace(/[\r\n]/g, '');
        docker(version);
      })
    })
  }
});