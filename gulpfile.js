var properties = {
  port: 8080, // LiveReload server port
  folders: {
    build: '../public/theme', // Deploy folder
    src: 'source', // Dev folder
  }
}

var plugins = {
  js: [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/jquery-ui/jquery-ui.min.js',
    'bower_components/slick-carousel/slick/slick.min.js'
  ],
  css: [
    'bower_components/reset-css/reset.css',
    'bower_components/jquery-ui/themes/base/jquery-ui.min.css',
    'bower_components/slick-carousel/slick/slick.css',
    'bower_components/slick-carousel/slick/slick-theme.css'
  ]
}

var
  gulp = require('gulp'),
  connect = require('gulp-connect'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  prefix = require('gulp-autoprefixer')
  babel = require('gulp-babel'),
  watch = require('gulp-watch');

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('scripts', function() {
  return gulp.src([
      properties.folders.src + '/scripts/app.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(babel())
    .on('error', onError)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(properties.folders.build + '/scripts'))
    .pipe(connect.reload());
});

gulp.task('vendor', function () {
	gulp.src(plugins.css)
	  .pipe(concat('vendor.css'))
	  .pipe(gulp.dest(properties.folders.build + '/styles/'));
	gulp.src(plugins.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(properties.folders.build + '/scripts/'));
});

gulp.task('jade', function() {
	gulp.src(properties.folders.src + '/views/*.jade')
		.pipe(jade({
			pretty: true
		}))
    .on('error', onError)
		.pipe(gulp.dest(properties.folders.build))
    .on('end', function(){
      gulp.src(properties.folders.build + '/**/*.html')
        .pipe(connect.reload());
    });
});

gulp.task('sass', function () {
	gulp.src(properties.folders.src + '/styles/main.scss')
    .pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(prefix("last 3 version", "> 1%", "ie 8", "ie 7"))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(properties.folders.build + '/styles'))
		//.pipe(connect.reload());
});

gulp.task('image', function () {
    gulp.src(properties.folders.src + '/images/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/images'))
});

gulp.task('font', function () {
    gulp.src(properties.folders.src + '/fonts/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/fonts'))
});

gulp.task('json', function () {
    gulp.src(properties.folders.src + '/json/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/json'))
});

gulp.task('server', function() {
  connect.server({
    port: properties.port,
		root: properties.folders.build,
		//livereload: true
	});
});

gulp.task('watch', function() {
	watch(properties.folders.src + '/views/**/*.jade', function() {
        gulp.start('jade');
	});
	watch(properties.folders.src + '/styles/**/*.scss', function() {
        gulp.start('sass');
	});
	watch(properties.folders.src + '/scripts/**/*.js', function() {
        gulp.start('scripts');
	});
    watch(properties.folders.src + '/images/**/*.*', function() {
        gulp.start('image');
    });
    watch(properties.folders.src + '/font/**/*.*', function() {
        gulp.start('font');
    });
    watch(properties.folders.src + '/json/**/*.*', function() {
        gulp.start('json');
    });
});

gulp.task('default', ['server', 'jade', 'scripts', 'vendor', 'sass', 'image', 'font', 'json', 'watch']);
