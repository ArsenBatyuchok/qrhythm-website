var gulp = require('gulp'),
    clean = require('gulp-clean'),
    minifyCss = require('gulp-minify-css'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    runSequence = require('gulp-run-sequence'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer');

var dist = 'dist',
    src = 'src',

    templatesSrc = src + '/templates',
    templatesDist = dist + '/templates',

    lessSrc = src + '/less',
    cssDist = dist + '/css',

    imgSrc = src + '/img',
    imgDist = dist + '/img',

    jsSrc = src + '/js',
    jsDist = dist + '/js';

gulp.task('default', ['watch'], function () {});

// clean task
gulp.task('clean', function() {
    return gulp.src(dist, {read: false})
        .pipe(clean());
});

// html task
gulp.task('html', function() {
  return gulp.src(src + '/*.html')
    .pipe(gulp.dest(dist))
    .pipe(connect.reload());
});

// task for fonts
gulp.task('fonts', function () {
  gulp.src(src + '/fonts/**/*.*')
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(connect.reload());
});

gulp.task('favicon', function() {
    gulp.src(src + '/favicon.png')
        .pipe(gulp.dest(dist))
        .pipe(connect.reload());
});

//img task
gulp.task('images', function() {
    return gulp.src(imgSrc + '/**/*.**')
        .pipe(gulp.dest(imgDist))
        .pipe(connect.reload());
});

// js task
gulp.task('js', function() {
    return gulp.src([
            jsSrc + '/app.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(jsDist))
        .pipe(connect.reload());
});

// task for compiling styles
gulp.task('styles', function() {
    return gulp.src(lessSrc + '/*.**')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(minifyCss())
        .pipe(gulp.dest(cssDist))
        .pipe(connect.reload());
});

// build static site for local testing
gulp.task('build-static', ['clean'], function(cb) {
    runSequence(['styles', 'images', 'favicon', 'js', 'html', 'fonts'], cb);
});

// run server via gulp-connect
gulp.task('server', ['build-static'], function() {
  connect.server({
    root: dist,
    livereload: true,
    port: 8484
  });
});

// watch task
gulp.task('watch', ['server', 'build-static'], function() {
    gulp.watch([lessSrc + '/**/*.less'], ['styles']);
    gulp.watch([src + '/*.html'], ['html']);
    gulp.watch([templatesSrc + '/*.*'], ['templates']);
    gulp.watch([jsSrc + '/**/*.js'], ['js']);
    connect.reload();
});