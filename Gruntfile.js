/* global module, require */
module.exports = function(grunt){
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    'js/src/_head.js',
                    'bower_components/moment/moment.js',
                    'js/src/functions.js',
                    'js/src/DatePicker.js',
                    'js/src/DateRangePicker.js',
                    'js/src/plugin.js',
                    'js/src/DPGlobal.js',
                    'js/src/data-api.js',
                    'js/src/_foot.js',
                ],
                dest: 'dist/bootstrap-datepicker.js',
            },
        },
        qunit: {
            all: ['tests/tests.html']
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all : [
                'js/src/*.js',
                'js/locales/*js',
                '!js/src/_*.js'
            ]
        },
        jscs: {
            gruntfile: ['Gruntfile.js'],
            main: ['js/src/*.js'],
            locales: ['js/locales/*js']
        },
        less: {
            main : {
                files: {
                    'dist/css/datepicker.standalone.css': 'less/build_standalone.less',
                    'dist/css/datepicker3.standalone.css': 'less/build_standalone3.less',
                    'dist/css/datepicker.css': 'less/build.less',
                    'dist/css/datepicker3.css': 'less/build3.less'
                }
            }
        },
        uglify: {
            options: {
                compress: true,
                mangle: true
            },
            main: {
                options: {
                    sourceMap: function(dest){
                        return dest.replace('.min.js', '.js.map');
                    }
                },
                files: {
                    'dist/bootstrap-datepicker.min.js': 'dist/bootstrap-datepicker.js',
                    'dist/bootstrap-datepicker.locales.min.js': 'js/locales/*.js'
                }
            },
        },
        cssmin: {
            all: {
                files: {
                    'dist/css/datepicker.min.css': 'dist/css/datepicker.css',
                    'dist/css/datepicker.standalone.min.css': 'dist/css/datepicker.standalone.css',
                    'dist/css/datepicker3.min.css': 'dist/css/datepicker3.css',
                    'dist/css/datepicker3.standalone.min.css': 'dist/css/datepicker3.standalone.css',
                }
            }
        },
        clean: ['dist']
    });


    grunt.registerTask('screenshots', 'Rebuilds automated docs screenshots', function(){
        var phantomjs = require('phantomjs').path;

        grunt.file.recurse('docs/_static/screenshots/', function(abspath){
            grunt.file.delete(abspath);
        });

        grunt.file.recurse('docs/_screenshots/', function(abspath, root, subdir, filename){
            if (!/.html$/.test(filename))
                return;
            subdir = subdir || '';

            var outdir = "docs/_static/screenshots/" + subdir,
                outfile = outdir + filename.replace(/.html$/, '.png');

            if (!grunt.file.exists(outdir))
                grunt.file.mkdir(outdir);

            grunt.util.spawn({
                cmd: phantomjs,
                args: ['docs/_screenshots/script/screenshot.js', abspath, outfile]
            });
        });
    });

    grunt.registerTask('lint', 'Lint all js files with jshint and jscs', ['jshint', 'jscs']);
    grunt.registerTask('test', 'Lint, concat then run unit tests', ['lint', 'concat', 'qunit']);
    grunt.registerTask('build', 'Builds minified files', ['clean', 'test', 'less', 'cssmin', 'uglify']);
    grunt.registerTask('default', 'build');

};
