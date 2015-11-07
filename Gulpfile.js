var gulp = require('gulp')
    ,$ = require('gulp-load-plugins')()
    ,webpack = require('webpack-config-stream')
    ,path = require('path')
    ,_ = require("lodash")
    ,browserSync = require("browser-sync")
    ,reload = browserSync.reload;

//sass编译
gulp.task('sass', function () {
  gulp.src('./_asset/style/scss/**/*.scss')
    .pipe($.sass(/*{outputStyle: 'compressed'}*/).on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./_asset/style/css/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./_asset/style/scss/**/*.scss', ['sass']);
});


// webpack
var src = '_asset/scripts/src/',
    dest = '_asset/scripts/dist/',
    configOptions = {
        debug: true,
        devtool: '#source-map',
        watchDelay: 200
    },
    compilerOptions = {
        useMemoryFs: true,
        progress: true
    },
    CONFIG_FILENAME = webpack.Config.FILENAME;


gulp.task('webpack', [], function() {
    return gulp.src(path.join(src, '**', CONFIG_FILENAME), { base: path.resolve(src) })
        .pipe(webpack.init(compilerOptions))
        .pipe(webpack.props(configOptions))
        .pipe(webpack.run())
        .pipe(webpack.format({
            version: false,
            timings: true
        }))
        .pipe(webpack.failAfter({
            errors: false,
            warnings: false
        }))
        // .pipe($.filter(function(file){
        //     return path.dirname(/(.*)+\.(js|css)$/.test(file.path));
        // }))
        .pipe(gulp.dest(dest));
});
gulp.task('webpack:watch',function() {
    gulp.watch(path.join(src, '**/*.*')).on('change', function(event) {
        if (event.type === 'changed') {
            gulp.src(event.path, { base: path.resolve(src) })
                .pipe(webpack.closest(CONFIG_FILENAME))
                .pipe(webpack.init(compilerOptions))
                .pipe(webpack.props(configOptions))
                .pipe(webpack.watch(function(err, stats) {
                    gulp.src(this.path, { base: this.base })
                        .pipe(webpack.proxy(err, stats))
                        .pipe(webpack.format({
                            verbose: true,
                            version: false
                        }))
                        .pipe(gulp.dest(dest));
                }));
        }
    });
});


//server & liveload
gulp.task('serve', ['default'], function(){
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });
    //仅需监视html==>js和css变动后会添加hash值后inject到html
    gulp.watch([
        'html/**/*.html'
        //'app/scripts/dist/**/*.js',
    ]).on('change', reload);
});


//inject 任务配资文件在config/injectJSON中
var injectJSON = require("./conf/injectJSON.js");
gulp.task("inject",function(){
        inject(injectJSON.file)
});
gulp.task("inject:watch",function(){
    gulp.watch("_asset/scripts/dist/**/*").on('change', function(event) {
        if (event.type === 'changed') {
            var basePath = path.dirname(path.relative(__dirname, event.path));
            var tmp = [];
            for(var a=0,len=injectJSON.file.length;a<len;a++){
                if(path.normalize(injectJSON.file[a].basePath)===basePath){
                    tmp.push(injectJSON.file[a])
                }
            };
            inject(tmp);
        }
    })
});

// helper
/**
 * [inject description]
 * @param  {[array]} fileList
 *  格式:
    // file:[
    //         {
    //             "fileName":"html/index.html",
    //             "basePath":"_asset/scripts/dist/a/",
    //             "dist":"html",
    //             "sources":{
    //                     "css":"_asset/scripts/dist/a/*.css",
    //                     "js":"_asset/scripts/dist/a/*.js"
    //             }
    //         }
    // ]
 */
function inject(fileList){
    var opts = {
        algorithm: 'sha1',
        hashLength: 8,
        template: '<%= name %><%= ext %>?v=<%= hash %>'
    };

    for(var a=0,len=fileList.length;a<len;a++){
        gulp.src(fileList[a].fileName)
          .pipe($.inject(gulp.src(fileList[a].sources.js, {read: true}).pipe($.hash(opts)), {relative: true}))
          .pipe($.inject(gulp.src(fileList[a].sources.css, {read: true}).pipe($.hash(opts)), {relative: true}))
          .pipe(gulp.dest(fileList[a].dist));
    }
}


//default
gulp.task("default",['webpack:watch','inject:watch']);


