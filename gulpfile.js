// Require gulp
const gulp = require("gulp");

// PATH
const PROJECT_FOLDER = require("path").basename(__dirname);
const SOURCE_FOLDER  = "#src";

let path = {
    build: {
        HTML:   `${PROJECT_FOLDER}/`,
        CSS:    `${PROJECT_FOLDER}/css`,
        JS:     `${PROJECT_FOLDER}/js`,
        IMG:    `${PROJECT_FOLDER}/img`,
        FONTS:  `${PROJECT_FOLDER}/fonts`,
    },
    src: {
        HTML:   [`${SOURCE_FOLDER}/*.html`, `!${SOURCE_FOLDER}/_*.html`],
        CSS:    `${SOURCE_FOLDER}/scss/style.scss`,
        JS:     `${SOURCE_FOLDER}/js/main.js`,
        IMG:    `${SOURCE_FOLDER}/img/**/*.+(png|jpg|gif|ico|svg|webp)`,
        FONTS:  `${SOURCE_FOLDER}/fonts/**/*.ttf`,
    },
    watch: {
        HTML:   `${SOURCE_FOLDER}/**/*.html`,
        CSS:    `${SOURCE_FOLDER}/scss/**/*.scss`,
        JS:     `${SOURCE_FOLDER}/js/**/*.js`,
        IMG:    `${SOURCE_FOLDER}/img/**/*.+(png|jpg|gif|ico|svg|webp)`,
    },
    clean: {
        DIST: `./${PROJECT_FOLDER}/`
    }
}

// Require variables
const { src, dest }  = require("gulp"),
        fs           = require("fs"),
        browsersync  = require("browser-sync"),
        del          = require("del"),
        scss         = require("gulp-sass")(require("sass")),
        autoprefixer = require("gulp-autoprefixer"),
        clean_css    = require("gulp-clean-css"),
        rename       = require("gulp-rename"),
        include      = require("gulp-file-include"),
        uglify_js    = require("gulp-uglify-es").default,
        webp         = require("gulp-webp"),
        webp_html    = require("gulp-webp-html"),
        ttf2woff     = require("gulp-ttf2woff"),
        ttf2woff2    = require("gulp-ttf2woff2"),
        fonter       = require("gulp-fonter");

// Functions
function browserSync() {
    browsersync.init({
        server: {
            baseDir: `./${PROJECT_FOLDER}/`,
        },
        port: 3000,
        notify: false,
    });
}

function html() {
    return src(path.src.HTML)
        .pipe(include())
        .pipe(webp_html())
        .pipe(dest(path.build.HTML))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.CSS)
        .pipe(
            scss({
                outputStyle: "expanded",
            }).on('error', scss.logError)
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true,
            })
        )
        .pipe(dest(path.build.CSS))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css",
            })
        )
        .pipe(dest(path.build.CSS))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.JS)
        .pipe(include())
        .pipe(dest(path.build.JS))
        .pipe(uglify_js())
        .pipe(
            rename({
                extname: ".min.js",
            })
        )
        .pipe(dest(path.build.JS))
        .pipe(browsersync.stream());
}

function img() {
    return src(path.src.IMG)
        .pipe(
            webp({
                quality: 90,
            })
        )
        .pipe(dest(path.build.IMG))
        .pipe(src(path.src.IMG))
        .pipe(dest(path.build.IMG))
        .pipe(browsersync.stream());
}

gulp.task("otf2ttf", () => {
    return src([`${SOURCE_FOLDER}/fonts/**/*.otf`])
        .pipe(fonter({
            formats: ["ttf"],
        }))
        .pipe(dest(`${SOURCE_FOLDER}/fonts/`));
})

function font() {
    src(path.src.FONTS)
        .pipe(ttf2woff())
        .pipe(dest(path.build.FONTS));
    return src(path.src.FONTS) 
        .pipe(ttf2woff2())
        .pipe(dest(path.build.FONTS));
}

function fontStyle() {
    let file_content = fs.readFileSync(`${SOURCE_FOLDER}/scss/fonts.scss`);
    if (file_content == '') {
        fs.writeFile(`${SOURCE_FOLDER}/scss/fonts.scss`, '', cb);
        return fs.readdir(path.build.FONTS, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(`${SOURCE_FOLDER}/scss/fonts.scss`, '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() {

}

function watchFiles() {
    gulp.watch([path.watch.HTML], html);
    gulp.watch([path.watch.CSS], css);
    gulp.watch([path.watch.JS], js);
    gulp.watch([path.watch.IMG], img);
}

function clean() {
    return del(path.clean.DIST);
}

let build = gulp.series(clean, gulp.parallel(html, css), js, img, font, fontStyle)
let watch = gulp.parallel(build, watchFiles, browserSync);

// Export
exports.default = watch;