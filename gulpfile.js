'use strict';

var gulp = require('gulp'),
    gulpins = require('gulp-load-plugins')(),
    config = {
        sassPath: './public/components/**/*.scss',
        cssPath: './public/components/**/*.css!(.map)',
        bowerDir: './bower_components'
    };

gulp.task('jshint', function() {
    return gulp.src(['app/components/**/*.js', 'public/**/*js'])
        .pipe(gulpins.jshint())
        .pipe(gulpins.jshint.reporter('jshint-stylish'))
        .pipe(gulpins.jshint.reporter('fail'));
});

gulp.task('sass', function() {
    return gulp.src(config.sassPath)
        .pipe(gulpins.rubySass({
            style: 'expanded',
            loadPath: [
                config.bowerDir + '/bootstrap-sass-official/assets/stylesheets'
            ]
        })
        .on('error', gulpins.notify.onError(function(error) {
            return 'Error: ' + error.message;
        })))
        .pipe(gulpins.autoprefixer('last 2 version'))
        .pipe(gulp.dest('./public/components'));
});

gulp.task('css', function() {
    return gulp.src(config.cssPath)
        .pipe(gulpins.concat('application.min.css'))
        .pipe(gulpins.minifyCss())
        .pipe(gulp.dest('./public/dist'));
});

gulp.task('watch', function() {
    var livereload = gulpins.livereload(),
        doReload = function(evt) {
            livereload.changed(evt.path);
        };

    // livereload watch
    //
    gulp.watch([
        'app/components/views/**/*.*',
        'public/components/**/*.html'
    ]).on('change', doReload);

    gulp.watch([
        'gulpfile.js',
        'server.js',
        'config/**/*.js',
        'app/**/*.js',
        'public/**/*.js',
        'app/components/tests/**/*.js'
    ], ['jshint']).on('change', doReload);

    gulp.watch([
        'public/**/*.css'
    ], ['css']).on('change', doReload);

    // Sass update watch
    gulp.watch([
        'public/**/*.scss'
    ], ['sass']);

});

gulp.task('bower', function() {
    return gulpins.bower()
        .pipe(gulp.dest(config.bowerDir));
});

gulp.task('connect', function() {
    gulpins.nodemon({
        script: 'server.js'
    });
});

gulp.task('build', ['connect', 'bower', 'watch', 'jshint', 'sass', 'css'], function() {
    //console.log('This will start the server');
});

gulp.task('default', function() {
    gulp.start('build');
});
