/* global module, require */
module.exports = function(grunt){
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '',
            },
            dist: {
                src: [
                    'js/src/_head.js',
                    'js/src/functions.js',
                    'js/src/DatePicker.js',
                    'js/src/DateRangePicker.js',
                    'js/src/plugin.js',
                    'js/src/DPGlobal.js',
                    'js/src/data-api.js',
                    'js/src/_foot.js',
                ],
                dest: 'js/bootstrap-datepicker.js',
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
            standalone: {
                files: {
                    '_build/datepicker.standalone.css': 'build/build_standalone.less',
                    '_build/datepicker3.standalone.css': 'build/build_standalone3.less'
                }
            },
            css: {
                files: {
                    '_build/datepicker.css': 'build/build.less',
                    '_build/datepicker3.css': 'build/build3.less'
                }
            },
            repo: {
                files: {
                    'css/datepicker.css': 'build/build_standalone.less',
                    'css/datepicker3.css': 'build/build_standalone3.less'
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
                    '_build/bootstrap-datepicker.min.js': 'js/bootstrap-datepicker.js',
                    '_build/bootstrap-datepicker.locales.min.js': 'js/locales/*.js'
                }
            },
            locales: {
                files: [{
                    expand: true,
                    cwd: 'js/locales/',
                    src: ['*.js', '!*.min.js'],
                    dest: '_build/locales/',
                    rename: function(dest, name){
                        return dest + name.replace(/\.js$/, '.min.js');
                    }
                }]
            }
        },
        cssmin: {
            all: {
                files: {
                    '_build/datepicker.standalone.min.css': '_build/datepicker.standalone.css',
                    '_build/datepicker.min.css': '_build/datepicker.css',
                    '_build/datepicker3.standalone.min.css': '_build/datepicker3.standalone.css',
                    '_build/datepicker3.min.css': '_build/datepicker3.css'
                }
            }
        },
        clean: ['_build']
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
    grunt.registerTask('test', 'Lint files and run unit tests', ['lint', 'concat', 'qunit']);
    grunt.registerTask('finish', 'Prepares repo for commit', ['test', 'less:repo', 'screenshots']);
    grunt.registerTask('dist', 'Builds minified files', ['less:css', 'less:standalone', 'cssmin', 'uglify']);
    grunt.registerTask('default', 'dist');

};
