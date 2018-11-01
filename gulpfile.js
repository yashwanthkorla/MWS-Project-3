let gulp = require('gulp');
let image = require('gulp-imagemin'); // To optimize the image
let pngquant = require('imagemin-pngquant'); // Used along with the imagemin
let cleancss = require('gulp-clean-css'); // TO minify the css
let autoprefix = require('gulp-autoprefixer'); // To add prefixes so that the css properties which are defined works accross all browsers.
let sourcemap = require('gulp-sourcemaps'); // To generate a meaningful mapping between the minified and original file.
let rename = require('gulp-rename'); //To rename the destination file
let jsmin = require('gulp-terser'); // To minify the js
let webp = require('gulp-webp'); // To convert the images to webp format
let workbox = require('workbox-build'); // To generate sw with pre cache links.
// Configuration to add prefix.
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

gulp.task('default',['imagemin','jsmin','cssmin','sw-precache','copy'],() => {
    console.log('Performing all tasks');
})
gulp.task('imagemin',() =>{
    gulp.src('img/**/*')
    .pipe(image({
        progressive : true,
        use :  [pngquant()],
        verbose: true
    }))
    .pipe(gulp.dest('Final/opt_img'))
})

gulp.task('cssmin',() => {
    gulp.src('css/*.css')
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.init())
    .pipe(autoprefix({
        browsers : AUTOPREFIXER_BROWSERS
    }))
    .pipe(cleancss())
    .pipe(sourcemap.write('../../sourcemap'))
    .pipe(gulp.dest('Final/opt_css'));
})

gulp.task('jsmin', () => {
    gulp.src('js/**/*.js')
    .pipe(jsmin())
    .pipe(gulp.dest('Final/opt_js'))
})

gulp.task('convertingtowebp',() => {
    gulp.src('Final/opt_img/**/*')
    .pipe(webp())
    .pipe(gulp.dest('Final/opt_webp'))
})

gulp.task('copy',() => {
    gulp.src(['*.html','manifest.json'])
    .pipe(gulp.dest('Final'))
})


gulp.task('sw-precache',() => {
    return workbox.injectManifest({
        "globDirectory": "Final/",
        "globPatterns": [
          "**/*.{html,json,css,jpg,png,js,webp}"
        ],
        "swDest": "Final\\sw.js",
        "swSrc": "sw.js"
    }).then((data) => {
        console.log(data);
        //The data parameter is an object which consists of count size and warning
        //If you want to debug, when you are facing issues then use these parameters.
    })
})