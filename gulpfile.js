/* eslint no-console: */

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const async = require('./utils/async');

const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');

gulp.task('dev', () => {
    return nodemon({
        ext: 'js html',
        script: 'server.js',
    });
});

gulp.task('lint', () => {
    return async()
        .then(() => {
            return gulp.src(['**/*.js', '!node_modules/**'])
                .pipe(eslint())
                .pipe(eslint.format())
                .pipe(eslint.failAfterError());
        });
});

const config = {
    connectionString: 'mongodb://localhost/PropertyDb',
    port: 3005,
};

gulp.task('start-server', ['lint'], () => {
    return async()
        .then(() => require('./app/db').connect(config.connectionString))
        .then((db) => {
            const data = require('./app/data').initData(db);
            const app = require('./app').initApp(data, db);
            return app;
        })
        .then((app) => {
            app.listen(
                config.port,
                () => console.log(`Magic happends at :${config.port}`));
        });
});
gulp.task('pre-test', () => {
    return gulp.src([
        './app/**/*.js',
        './server.js',
    ])
        .pipe(istanbul({
            includeUntested: true,
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test:unit', ['pre-test'], () => {
    return gulp.src([
        './test/unit/**/*.js',
        './test/integration/**/*.js',
    ])
        .pipe(mocha({
            reporter: 'nyan',
        }))
        .pipe(istanbul.writeReports());
});
