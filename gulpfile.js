var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('default', ['serve']);

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
