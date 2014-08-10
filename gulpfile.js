'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync');

var paths = {
  app: 'app',
  tmp: '.tmp',
  dist: 'dist'
};

gulp.task('default', ['build']);

gulp.task('wiredep', function () {
  return gulp.src(paths.app + '/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest(paths.app));
});

gulp.task('stylus', function () {
  return gulp.src(paths.app + '/css/main.styl')
    .pipe($.stylus())
    .pipe($.autoprefixer())
    .pipe(gulp.dest(paths.tmp + '/css'));
});

gulp.task('build', ['wiredep', 'stylus'], function () {
  return gulp.src(paths.app + '/index.html')
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['wiredep', 'stylus'], function () {
  gulp.watch(['bower.json'], ['wiredep']);
  gulp.watch([paths.app + '/css/**.*'], ['stylus']);

  browserSync.init(null, {
    server: {
      baseDir: [paths.app, paths.tmp]
    },
    notify: false
  });

  gulp.watch([paths.tmp + '/**/*'], function() {
    browserSync.reload({ once: true });
  }); 
});

gulp.task('serve', function () {
  browserSync.init(null, {
    server: {
      baseDir: paths.dist
    },
    notify: false
  });
});

