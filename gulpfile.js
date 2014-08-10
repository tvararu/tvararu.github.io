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

gulp.task('default', ['watch']);

gulp.task('build', ['html', 'css', 'js']);

gulp.task('wiredep', function () {
  return gulp.src(paths.app + '/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest(paths.app));
});

gulp.task('html', ['wiredep'], function () {

});

gulp.task('css', function () {
  return gulp.src(paths.app + '/css/main.styl')
    .pipe($.stylus())
    .pipe($.autoprefixer())
    .pipe(gulp.dest(paths.tmp + '/css'));
});

gulp.task('js', function () {
  
});

gulp.task('watch', ['build'], function () {
  gulp.watch(['bower.json'], ['wiredep']);
  gulp.watch([paths.app + '/css/**.*'], ['css']);
  gulp.watch([paths.app + '/js/**.*'], ['js']);

  gulp.start('serve');
});

gulp.task('serve', function () {
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

gulp.task('serve:dist', function () {
  browserSync.init(null, {
    server: {
      baseDir: paths.dist
    },
    notify: false
  });
});

