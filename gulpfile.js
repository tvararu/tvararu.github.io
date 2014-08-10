'use strict';

var path = require('path');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync');

var paths = {
  app: './app',
  tmp: './tmp',
  dist: './dist'
};

gulp.task('default', ['build']);

gulp.task('serve', function() {
  browserSync.init(null, {
    server: {
      baseDir: './'
    },
    notify: false
  });

  gulp.watch([
    './*.html',
    './css/**/*.css',
    './js/**/*.js'
  ], function() {
    browserSync.reload({ once: true });
  });
});

gulp.task('build', function () {
  return gulp.src(path.join(paths.app, 'index.html'))
    .pipe(wiredep())
    .pipe(gulp.dest(paths.tmp));
});

