'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 2.3',
  'bb >= 10'
];

gulp.task('jshint', function () {
  return gulp.src([
      '_resource/js/**/*.js',
      '!_resource/js/jquery-1.11.1.min.js',
      '!_resource/js/masonry.pkgd.min.js',
      '!_resource/js/handlebars-v2.0.0.js'
    ])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('images', function () {
  return gulp.src('_resource/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('html/img'))
    .pipe($.size({title: 'img'}));
});

gulp.task('copy', function () {
  return gulp.src([
    '_resource/**/*',
    '!_resource/**/*.scss'
  ], {
    dot: true
  }).pipe(gulp.dest('html'))
    .pipe($.size({title: 'copy'}));
});

gulp.task('styles', function () {
  return gulp.src([
      '_resource/css/**/*.scss',
      '_resource/css/**/*.css'
    ])
    .pipe($.sass({errLogToConsole: true})
      .on('error', console.error.bind(console))
    )
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.if('*.css', $.cssbeautify()))
    .pipe($.if('*.css', $.csscomb()))
    // .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('html/css'))
    .pipe($.size({title: 'css'}));
});

gulp.task('html', function () {
  var assets = $.useref.assets({searchPath: '{html, _resource}'});

  return gulp.src(['_resource/**/*.html'])
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    .pipe($.if('*.css', $.uncss({
      html: [
        '_resource/index.html'
      ]
    })))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml()))
    .pipe(gulp.dest('html'))
    .pipe($.size({title: 'html'}));
});

gulp.task('clean', del.bind(null, ['html']));

gulp.task('server', ['styles', 'html', 'copy'], function () {
  browserSync({
    notify: false,
    server: ['html']
  });

  gulp.watch(['_resource/**/*.html'], ['html', reload]);
  gulp.watch(['_resource/css/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['_resource/js/**/*.js'], ['jshint', 'copy', reload]);
  gulp.watch(['_resource/img/**/*'], reload);
});

gulp.task('server:dist', ['default'], function () {
  browserSync({
    notify: false,
    server: 'html'
  });
});

gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['jshint', 'html', 'images', 'copy'], cb);
});
