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

gulp.task('build:base', ['wiredep', 'stylus', 'images'], function () {
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

var CRIT = "html{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}a{background:0 0}*,::after,::before{box-sizing:border-box}.container,body,html{width:100%;height:100%;font-family:'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5em;color:#333}.container{background:#ecf0f1;position:relative}#logo-wrapper{width:16em;height:8em;position:absolute;left:50%;top:4em;-webkit-transform:translate3d(-50%,0,0);transform:translate3d(-50%,0,0)}#logo{width:16em;height:8em;position:absolute;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}#logo-background,#logo-foreground{position:absolute}#logo-background{background:url(../img/logo-main-grey.png) 0 0/16em 8em no-repeat;width:16em;height:8em;-webkit-transform:scale(0.99);transform:scale(0.99)}#logo-foreground{background:url(../img/logo-main-white.png) 0 0/16em 8em no-repeat;width:16em;height:8em;-webkit-transform:translateZ(10px);transform:translateZ(10px)}@media all and (-webkit-min-device-pixel-ratio:1.5){#logo-background{background-image:url(../img/logo-main-grey@2x.png)}#logo-foreground{background-image:url(../img/logo-main-white@2x.png)}}.copy{width:16em;position:absolute;left:50%;top:16em;-webkit-transform:translate3d(-50%,0,0);transform:translate3d(-50%,0,0);text-align:center}.copy .name{font-size:2em;line-height:2em;margin-bottom:1em;font-weight:400}.copy .two-col span{width:8em;float:left;font-weight:600}.copy .links a{color:#333;line-height:4em;width:100%;height:100%;position:relative;display:inline-block;outline:0;vertical-align:bottom;text-decoration:none;white-space:nowrap}.link-animate a::before{position:absolute;top:0;left:-5px;z-index:-1;box-sizing:content-box;padding:0 5px;width:100%;height:100%;background-color:#fff;content:'';opacity:0;-webkit-transition:-webkit-transform .2s,opacity .2s;transition:transform .2s,opacity .2s;-webkit-transition-timing-function:cubic-bezier(0.25,.25,.325,1.39);transition-timing-function:cubic-bezier(0.25,.25,.325,1.39);-webkit-transform:scale(0);transform:scale(0)}";

gulp.task('critical', ['build:base'], function(done){
  penthouseAsync({
    url: 'http://localhost:3000',
    css: paths.dist + '/css/main.css'
  }).then(function (criticalCSS) {
    // CRIT = criticalCSS.replace('\n', '');
    done();
  });
});

gulp.task('build:critical', ['critical'], function () {
  return gulp.src(paths.dist + '/index.html')
    .pipe($.replace(
      '<link rel=stylesheet href=css/main.css>',
      '<style>' + CRIT + '</style>'
    ))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['build:critical'], function(){
  return gulp.src(paths.dist + '/**/*')
    .pipe($.manifest({
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*', '*'],
      filename: 'app.manifest',
      exclude: 'app.manifest'
    }))
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


