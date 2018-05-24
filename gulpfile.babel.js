import gulp from 'gulp';
// Initialize browser sync.
let browserSync = require('browser-sync').create();

// Read the default configuration.
let config = require('./config.json');

// Include plugins.
import sass from 'gulp-sass';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import autoprefix from 'gulp-autoprefixer';
import glob from 'gulp-sass-glob';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import shell from 'gulp-shell';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import fancylog from 'fancy-log';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

// Require a copy of the JS compiler for uswds.
// the gulptask is called "javascript"
// the following task compiles the node_modules/uswds/src/js/start.js file.
require('./gulptasks/javascript');

// If local configuration exists, merge the paramenters.
try {
    let local_config = require('./config.local.json');
    config = _.merge(config, local_config);
}
catch (e) {
    // Do nothing.
}

// Error Handler
// -------------------------------------------------------------- //
let errorHandler = (error) => {
    notify.onError({
        title: 'Task Failed [' + error.plugin + ']',
        message: 'Error: <%= error.message %>',
        sound: 'Beep'
    })(error);
    // Log error to console, unless that's already happening. Sass lint provides
    // good error handling/feedback in the terminal, so in this case we only want
    // the OS X notification w/sound.
    if (error.plugin !== 'gulp-sass') {
        console.log(error.toString());
    }
    // Prevent Gulp watch from stopping.
    this.emit('end');
};

// CSS.
// -------------------------------------------------------------- //

gulp.task('css', () => {
    return gulp.src(config.css.src)
        .pipe(glob())
        .pipe(plumber({
            errorHandler: function (error) {
                notify.onError({
                    title: "Gulp",
                    subtitle: "Failure!",
                    message: "Error: <%= error.message %>",
                    sound: "Beep"
                })(error);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            errLogToConsole: true,
            includePaths: config.css.includePaths
        }))
        .pipe(autoprefix('last 2 versions', '> 1%', 'ie 9', 'ie 10'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.css.pattern_lab_destination))
        .pipe(gulp.dest(config.css.dist_folder))
        .pipe(browserSync.reload({stream: true, match: '**/*.css'}));
});

// Pattern lab CSS.
// ----------------------------------------------------------------- //
// Search for changes inside the pattern-lab/source/_patterns folders
// the scss processor is going to compile scss files inside the components folders.
// ----------------------------------------------------------------- //

gulp.task('pl:scss', () => {
    return gulp.src(config.css.src, {base: './'})
        .pipe(glob())
        .pipe(plumber({
            errorHandler: function (error) {
                notify.onError({
                    title: "Gulp",
                    subtitle: "Failure!",
                    message: "Error: <%= error.message %>",
                    sound: "Beep"
                })(error);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass(config.sass))
        .pipe(autoprefix(config.autoprefixer))
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace(/src/i, 'dist');
            return path;
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'))
        .pipe(browserSync.reload({stream: true, match: '**/*.css'}));
});

// Watch task.
// ------------------------------------------------------------------- //

gulp.task('watch', function () {
    gulp.watch(config.css.src, ['pl:generate']);
    gulp.watch(config.pattern_lab.src, ['pl:generate']);
    gulp.watch(config.pattern_lab.javascript.src, ['pl:generate']);
});

// Static Server + Watch.
// ------------------------------------------------------------------- //

gulp.task('serve', ['pl:generate', 'watch'], () => {
    browserSync.init({
        serveStatic: ['./pattern-lab/public']
    });
});

// Generate pl with PHP.
// -------------------------------------------------------------------- //

gulp.task('pl:generate', ['uswds:javascript', 'css', 'js:components'], () => shell.task('php pattern-lab/core/console --generate'));

// Component JS.
// -------------------------------------------------------------------- //
// the following task concatenates all the javascript files inside the
// _patterns folder, if new patterns need to be added the config.json array
// needs to be edited to watch for more folders.

gulp.task('js:components', () => {
    return gulp.src(config.pattern_lab.javascript.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat("components.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./pattern-lab/public/js'))
        .pipe(gulp.dest('./dist/pl/js'))
        .pipe(browserSync.reload({stream: true, match: '**/*.js'}));
});

// Default Task
// --------------------------------------------------------------------- //

gulp.task('default', ['serve']);
