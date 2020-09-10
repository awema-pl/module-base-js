const gulp = require('gulp')
const clean = require('gulp-clean')
const plumber = require('gulp-plumber')
const noop = require('gulp-noop')
const sourcemaps = require('gulp-sourcemaps')
const rollup = require('gulp-rollup')
const browserSync = require('browser-sync').create()

// Modes
const isDev = process.env.NODE_ENV === 'development'


/*
 * Server
 */

if ( isDev ) {
  gulp.task('serve', function(){

    browserSync.init({
      ui: false,
      open: false,
      notify: false,
      server: ['./examples', './dist']
    })

    gulp.watch(['./resources/js/**/*.js', './resources/vue/**/*.vue'], gulp.series('build:js', 'reload'))
    gulp.watch('./examples/**/*.html', gulp.series('reload'))
  })

  gulp.task('reload', function(done) { browserSync.reload(); done() })
}


/*
 * JS
 */

const rollupConfig = require('./rollup.config.js')
rollupConfig.rollup = require('rollup')
rollupConfig.allowRealFiles = true, // solves gulp-rollup hipotetical file system problem

gulp.task('build:js', function(){
  return gulp.src('./resources/js/main.js')
    .pipe( plumber() )
    .pipe( isDev ? sourcemaps.init() : noop() )
    .pipe( rollup(rollupConfig) )
    .pipe( isDev ? sourcemaps.write() : noop() )
    .pipe( gulp.dest('./dist/js') )
})


/*
 * Gloabl tasks
 */

gulp.task('clean', function(){
  return gulp.src('./dist', { read: false, allowEmpty: true })
    .pipe( clean() )
})

gulp.task('build', gulp.series('build:js') )

// start
defaultTask = ['clean', 'build']
if ( isDev ) defaultTask.push('serve')
gulp.task('default', gulp.series(defaultTask) )
