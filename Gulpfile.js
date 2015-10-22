var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


gulp.task('sass', function () {
  gulp.src('./_asset/style/scss/**/*.scss')
    .pipe($.sass(/*{outputStyle: 'compressed'}*/).on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./_asset/style/css/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./_asset/style/scss/**/*.scss', ['sass']);
});
