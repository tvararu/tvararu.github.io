'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync');
var saveLicense = require('uglify-save-license');
var penthouse = require('penthouse');
var Promise = require('bluebird');
var penthouseAsync = Promise.promisify(penthouse);
var fs = require('fs');
var pagespeed = require('psi');
var ngrok = require('ngrok');

var paths = {
  app: 'app',
  tmp: '.tmp',
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
  uglify: {
    preserveComments: saveLicense
  },
  imagemin: {
    progressive: true,
    interlaced: true
  }
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
    .pipe($.autoprefixer(opts.autoprefixer))
    .pipe(gulp.dest(paths.tmp + '/css'));
});

gulp.task('images', function () {
  return gulp.src(paths.app + '/img/**.*')
    .pipe($.cache($.imagemin(opts.imagemin)))
    .pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('prebuild', ['wiredep', 'stylus', 'images'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var htmlFilter = $.filter('**/*.html');
  var assets = $.useref.assets();

  return gulp.src(paths.app + '/index.html')
    .pipe(assets)

    .pipe(jsFilter)
    .pipe($.uglify(opts.uglify))
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

gulp.task('build', ['critical'], function () {
  return gulp.src(paths.dist + '/index.html')
    .pipe($.replace('css/main.css', 'css/critical.css'))
    .pipe($.inlineCss())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['wiredep', 'stylus'], function () {
  gulp.watch(['bower.json'], ['wiredep']);
  gulp.watch([paths.app + '/css/**.*'], ['stylus']);

  browserSync.init(null, {
    server: {
      baseDir: [paths.app, paths.tmp]
    }
  });

  gulp.watch([paths.tmp + '/**/*'], function() {
    browserSync.reload({ once: true });
  }); 
});

gulp.task('serve', function () {
  browserSync.init(null, {
    server: {
      baseDir: paths.dist
    }
  });
});

gulp.task('critical', ['prebuild'], function(done){
  penthouseAsync({
    url: 'http://localhost:3000',
    css: paths.dist + '/css/main.css',
    height: 480
  }).then( function (criticalCSS){
    fs.writeFile(paths.dist + '/css/critical.css', criticalCSS, done);
  });
});

gulp.task('pagespeed', function (done) {
  ngrok.connect(3000, function(err, url) {
    pagespeed({
      url: url,
      strategy: 'mobile'
    }, function () {
      done();
      process.exit(0);
    });
  });
});


