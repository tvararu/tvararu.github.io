'use strict';

var path = require('path');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync');

var paths = {
  app: 'app',
  tmp: '.tmp',
  dist: 'dist'
};

gulp.task('default', ['watch']);

gulp.task('build', ['html', 'css', 'js']);

gulp.task('wiredep', function () {
  return gulp.src(path.join(paths.app, 'index.html'))
    .pipe(wiredep())
    .pipe(gulp.dest(paths.app));
});

gulp.task('html', ['wiredep'], function () {
  return gulp.src(path.join(paths.app, 'index.html'))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function () {
  
});

gulp.task('js', function () {
  
});

gulp.task('watch', ['build'], function () {
  gulp.watch([path.join(paths.tmp, '*.html')], ['html']);
  gulp.watch([path.join(paths.tmp, 'css')], ['css']);
  gulp.watch([path.join(paths.tmp, 'js')], ['js']);

  gulp.start('serve');
});

gulp.task('serve', function () {
  browserSync.init(null, {
    server: {
      baseDir: [paths.app, paths.tmp],
      index: path.join(paths.tmp, 'index.html')
    },
    notify: false
  });

  gulp.watch([path.join(paths.tmp, '**/*')], function() {
    browserSync.reload({ once: true });
  }); 
});

gulp.task('serve:dist', function () {
  browserSync.init(null, {
    server: {
      baseDir: paths.dist
    },
    notify: false
  });
});

