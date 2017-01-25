const packageJson = require('./package.json');

const del = require('del');
const gulp = require('gulp');
const gulpCopy = require('gulp-copy');
const sequence = require('gulp-sequence');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('./tsconfig.json');
const src = tsProject.config.files || ['./typings/index.d.ts'];
const dest = './dist/';

gulp.task('clean', function () {
	return del(dest);
});

gulp.task('compile-ts', function (cb) {
	return gulp.src(src.concat('./src/**/*.ts'))
		.pipe(tsProject())
		.pipe(gulp.dest(dest));
});

gulp.task('copy-files', function () {
	return gulp.src(['./package.json', './typings.json', './README.md', './config.json', './log4js.json', './favicon.ico', './pages/**'])
		.pipe(gulpCopy(dest));
});

gulp.task('default', function (cb) {
	sequence('clean', 'copy-files', 'compile-ts', cb);
});
