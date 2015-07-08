'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

var paths = {
  app: 'app',
  dist: 'dist'
};

var opts = {
  autoprefixer: [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ],
  imagemin: {
    progressive: true,
    interlaced: true
  }
};

gulp.task('default', ['build:base']);

gulp.task('wiredep', function() {
  return gulp.src(paths.app + '/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest(paths.app));
});

gulp.task('stylus', function() {
  return gulp.src(paths.app + '/css/main.styl')
    .pipe($.stylus())
    .pipe($.autoprefixer(opts.autoprefixer))
    .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('images', function() {
  return gulp.src(paths.app + '/img/**.*')
    .pipe($.cache($.imagemin(opts.imagemin)))
    .pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('build:base', ['wiredep', 'stylus', 'images'], function() {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var htmlFilter = $.filter('**/*.html');
  var assets = $.useref.assets();

  return gulp.src(paths.app + '/index.html')
    .pipe(assets)

    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore())

    .pipe(cssFilter)
    .pipe($.minifyCss())
    .pipe(cssFilter.restore())

    .pipe(assets.restore())
    .pipe($.useref())

    .pipe(htmlFilter)
    .pipe($.minifyHtml())
    .pipe(htmlFilter.restore())

    .pipe(gulp.dest(paths.dist));
});
