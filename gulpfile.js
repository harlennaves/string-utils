var gulp = require("gulp");
var typescript = require("gulp-typescript");
var uglify = require("gulp-uglify");

var config = {
  sourceFiles : "./src/**/*.ts",
  destFolder : "./dist/",
  destFile : "string-extensions.js",
  destMinFile : "string-extensions.min.js"
};


function compile() {
  return gulp.src(config.sourceFiles).pipe(typescript({noImplicitAny : true, out: config.destFile})).js.pipe(gulp.dest(config.destFolder));
}

function minify() {
  return gulp.src(config.sourceFiles).pipe(typescript({noImplicitAny : true, out: config.destMinFile})).js.pipe(uglify()).pipe(gulp.dest(config.destFolder));
}

function generateRef() {
  var result = gulp.src(config.sourceFiles).pipe(typescript({noImplicitAny : true, declaration : true}));
  return result.dts.pipe(gulp.dest(config.destFolder));
}


gulp.task("generate", compile);
gulp.task("minify", minify);
gulp.task("ref", generateRef);

gulp.task("compile", ["generate", "minify", "ref"]);
