'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
// // 皮肤打包使用
const fs = require('fs');
const async = require('async');
const minimist = require('minimist');
const minifyCss = require('gulp-minify-css');
const path = require('path');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

require('./config/gulp/gulp-sonar');
require('./config/gulp/gulp-build');
require('./config/gulp/gulp-docker');
require('./config/gulp/gulp-tag-docker');

gulp.task('default', () => {
  //'sonar',
  runSequence('build', cb);
});

gulp.task('release', () => {
  //'sonar',
  runSequence('build', 'tag-docker', cb);
});

// 皮肤打包路径
const skinUrl = './themes/**/*.scss';
// 皮肤打包
gulp.task('skinCss', function () {
  gulp
    .src(skinUrl)
    .pipe(
      sass({
        style: 'expanded'
      })
    )
    .pipe(gulp.dest('./public/themes'));
});
/* skin打包开始 */
gulp.task('buildSkin', function () {
  // 从element-theme-chalk中scss获取
  const config = {
    themePath: 'node_modules/element-theme-chalk',
    cssFiles: '*',
    varPath: './src/common/var.scss'
  };
  // 定义需要生成的文件 新增一个文件名需要在此处添加对应的文件名
  const array = [{
    path: 'white'
  },
  {
    path: 'black'
  }
  ];
  const functionArray = [];
  for (let i = 0; i < array.length; i++) {
    const fspath = array[i].path;
    // 重写elemenet-ui的var.scss
    functionArray.push(function (cb) {
      const varsPath = path.resolve(config.themePath, config.varPath);
      fs.writeFileSync(varsPath, fs.readFileSync(`src/themes/${fspath}/variables.scss`), 'utf-8');
      console.log(`${fspath} element-ui var.scss have changed`);
      // const whateverVarsPath = path.resolve('node_modules/@gsafety/whatever/dist/styles/vars.scss');
      // fs.writeFileSync(whateverVarsPath, fs.readFileSync(`src/themes/${fspath}/whatever-variables.scss`), 'utf-8');
      // console.log(`${fspath} whatever var.scss have changed`);
      const systemVarPath = path.resolve('./src/assets/styles/vars.scss');
      fs.writeFileSync(systemVarPath, fs.readFileSync(`src/themes/${fspath}/business-variables.scss`), 'utf-8');
      console.log(`${fspath} business var.scss have changed`);
      cb(null, i);
    });
    // 编译打包并合并`
    functionArray.push(function (cb) {
      gulp
        .src([
          path.resolve(config.themePath, './src/index.scss'),
          `src/themes/${fspath}/**/*`,
          'src/assets/iconfont/iconfont.css',
          'src/assets/styles/index.scss',
          // `node_modules/@gsafety/whatever/dist/iconfont/whatever-font.css`,
          `node_modules/@gsafety/whatever/dist/themes/${fspath}/**/*`
        ])
        .pipe(sass.sync())
        .pipe(concat('themes.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(`./public/themes/${fspath}`))
        .on('end', () => {
          console.log(`${fspath} themes.css created end`);
          cb(null, i);
        });
    });
    // 将fonts打包进themes
    functionArray.push(function (cb) {
      gulp
        .src([
          path.resolve(config.themePath, './src/fonts/**/*'),
          '!src/assets/iconfont/iconfont.css',
          'src/assets/iconfont/**/*'
          // `!node_modules/@gsafety/whatever/dist/iconfont/whatever-font.css`,
          // `node_modules/@gsafety/whatever/dist/iconfont/**/*`
        ])
        .pipe(gulp.dest(`./public/themes/${fspath}/fonts`))
        .on('end', () => {
          console.log(`${fspath} fonts created end`);
          cb(null, i);
        });
    });
    // 将图片打包进themes
    functionArray.push(function (cb) {
      gulp
        .src(['src/assets/img/**/*'])
        .pipe(gulp.dest(`./public/themes/${fspath}/img`))
        .on('end', () => {
          console.log(`${fspath} img created end`);
          cb(null, i);
        });
    });
  }
  async.series([...functionArray], (err, values) => {
    console.log('skin build end');
  });
});

// 移动themes的字体文件
gulp.task('moveFonts', function () {
  gulp
    .src('./src/assets/iconfont/*')
    .pipe(gulp.dest('./public/themes/icons'))
    .on('end', () => {
      console.log(`icons have moved`);
    });
});

// 移动themes的icons文件
gulp.task('moveIcons', function () {
  gulp
    .src('./src/assets/img/**/*')
    .pipe(gulp.dest('./public/themes/icons'))
    .on('end', () => {
      console.log(`icons have moved`);
    });
});
// 创建新的变量文件 gulp createThemes --env xxx
gulp.task('createThemes', function () {
  const knownOptions = {
    string: 'env',
    default: {
      env: process.env.NODE_ENV || 'production'
    }
  };
  console.dir(process.argv.slice(2));
  const options = minimist(process.argv.slice(2), knownOptions);
  console.dir(options);

  const createPath = options.env;
  const varsPath = path.resolve('node_modules/element-theme-chalk', './src/styles/variables.scss');
  if (/^[a-z]+$/.test(createPath)) {
    fs.mkdir(`./themes/${createPath}`, err => {
      if (err) {
        return false;
      }
    });
    fs.writeFileSync(`./themes/${createPath}/variables.scss`, fs.readFileSync(varsPath), 'utf-8');
    console.log(`new themes scss have created`);
  } else {
    console.log(`只能输入小写`);
  }
});
/* skin打包结束 */

function cb(err) {
  console.log(err);
}