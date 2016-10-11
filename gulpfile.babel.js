import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import watchify from 'watchify';
import assign from 'lodash.assign';
import wrap from 'gulp-wrap';
import eslint from 'gulp-eslint';
import plumber from'gulp-plumber';
import uglify from 'gulp-uglify';
import pump from 'pump';

//custom browserify options
var customOpts = {
    entries: ['./src/js/index.js'],
    debug: true,
    plugin: [
        [ "browserify-derequire" ]
    ],
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

//transformations
b.transform(babelify);

gulp.task('lint', lint); // run `gulp lint` to lint the file
gulp.task('js', bundle); // run `gulp js` to build the file continuously
gulp.task('compress', ['set-prod-node-env'], compress); // run `gulp compress` to compress the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

gulp.task('set-prod-node-env', function() {
    return process.env.NODE_ENV = 'production';
});

function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('compiled.js'))
        //wrap define = undefined; to be compatible with RequireJS
        .pipe(wrap('(function () { var define = undefined; <%=contents%> })();'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./'));
}

function compress(cb) {
  pump([
        gulp.src('compiled.js'),
        uglify(),
        gulp.dest('./')
    ],
    cb
  );
}

function fixErrorHandling() {
    return plumber({
        errorHandler(err) {
          gutil.log(err.stack);
        }
    });
}

function lint() {
    return gulp.src('./src/**/*.js')
        .pipe(fixErrorHandling())
        .pipe(eslint())
        .pipe(eslint.format())
        // for some reason eslint doesn't work without this
        .on('data', file => {});
}
