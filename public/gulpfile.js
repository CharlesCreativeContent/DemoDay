var gulp = require("gulp");
var sass = require("gulp-sass");
var changed = require('gulp-changed');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');

const { series, parallel } = gulp;

function style(cb) {
    // Theme
    gulp.src('./assets/scss/**/*.scss')
    .pipe(changed('./assets/css/'))
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', sass.logError)
    .pipe(autoprefixer([
        "last 1 major version",
        ">= 1%",
        "Chrome >= 45",
        "Firefox >= 38",
        "Edge >= 12",
        "Explorer >= 10",
        "iOS >= 9",
        "Safari >= 9",
        "Android >= 4.4",
        "Opera >= 30"], { cascade: true }))
    .pipe(gulp.dest('./assets/css/'))
    .pipe(browserSync.stream());
    cb();
}

function minCss(cb) {
    return gulp.src([
        './assets/css/theme.css',
    ])
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./assets/css/'));
    cb();
}

exports.style = series(style, minCss);

function minJS(cb) {
    return gulp.src([
        './assets/js/hs.core.js',
        './assets/js/components/hs.bg-video.js',
        './assets/js/components/hs.chartist-area-chart.js',
        './assets/js/components/hs.chartist-bar-chart.js',
        './assets/js/components/hs.chart-pie.js',
        './assets/js/components/hs.clipboard.js',
        './assets/js/components/hs.countdown.js',
        './assets/js/components/hs.counter.js',
        './assets/js/components/hs.cubeportfolio.js',
        './assets/js/components/hs.datatables.js',
        './assets/js/components/hs.dropzone.js',
        './assets/js/components/hs.fancybox.js',
        './assets/js/components/hs.file-attach.js',
        './assets/js/components/hs.focus-state.js',
        './assets/js/components/hs.g-map.js',
        './assets/js/components/hs.go-to.js',
        './assets/js/components/hs.hamburgers.js',
        './assets/js/components/hs.header.js',
        './assets/js/components/hs.header-fullscreen.js',
        './assets/js/components/hs.instagram.js',
        './assets/js/components/hs.malihu-scrollbar.js',
        './assets/js/components/hs.modal-window.js',
        './assets/js/components/hs.onscroll-animation.js',
        './assets/js/components/hs.password-strength.js',
        './assets/js/components/hs.progress-bar.js',
        './assets/js/components/hs.quantity-counter.js',
        './assets/js/components/hs.range-datepicker.js',
        './assets/js/components/hs.range-slider.js',
        './assets/js/components/hs.scroll-effect.js',
        './assets/js/components/hs.scroll-nav.js',
        './assets/js/components/hs.selectpicker.js',
        './assets/js/components/hs.show-animation.js',
        './assets/js/components/hs.slick-carousel.js',
        './assets/js/components/hs.step-form.js',
        './assets/js/components/hs.sticky-block.js',
        './assets/js/components/hs.summernote-editor.js',
        './assets/js/components/hs.svg-injector.js',
        './assets/js/components/hs.toggle-state.js',
        './assets/js/components/hs.unfold.js',
        './assets/js/components/hs.validation.js',
        './assets/js/components/hs.video-player.js',
        './assets/js/theme-custom.js',
    ])
    .pipe(concat('theme.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
    cb();
}

exports.minJS = minJS;

function copyVendors() {
    gulp.src([
        './node_modules/*animate.css/**/*',
        './node_modules/*bootstrap-select/**/*',
        './node_modules/*chartist/**/*',
        './node_modules/*custombox/**/*',
        './node_modules/*clipboard/**/*',
        './node_modules/*datatables/**/*',
        './node_modules/*flag-icon-css/**/*',
        './node_modules/*flatpickr/**/*',
        './node_modules/*gmaps/**/*',
        './node_modules/*instafeed.js/**/*',
        './node_modules/*ion-rangeslider/**/*',
        './node_modules/*jquery/**/*',
        './node_modules/*jquery-migrate/**/*',
        './node_modules/*jquery-validation/**/*',
        './node_modules/*popper.js/**/*',
        './node_modules/*summernote/**/*',
        './node_modules/*svg-injector/**/*',
        './node_modules/*typed.js/**/*',
    ])
    .pipe(gulp.dest('./dist/assets/vendor/'))
}

exports.copyVendors = copyVendors;
