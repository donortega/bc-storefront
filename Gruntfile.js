'use strict';
/* jshint indent: 2 */

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    /**
    * Set path variables for the files we want to include in the build
    */
    var
        appConfigVars = {
            bowerSource: 'bower_components',
            jsSource: 'js',
            jsDevPath: 'app/assets/js/dev',
            jsBuildPath: 'app/assets/js/build',
            dataPath: 'app/assets/json',
            compassSource: 'sass',
            compassHttpPath: 'app',
            compassDevPath: 'app/assets/css/dev',
            compassBuildPath: 'app/assets/css/build',
            compassImportPath: [
                'bower_components/bootstrap-sass/assets/stylesheets',
                'bower_components/components-font-awesome/scss',
            ],
            compassImagesPath: 'app/assets/i',
            compassImagesDir: 'assets/i',
            compassFontsPath: 'app/assets/fonts'
        }
    ;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appConfig: appConfigVars,

        /**
        * Set up server at http://localhost:9000
        */
        express: {
            'dev': {
                options: {
                    bases: ['app'],
                    hostname: 'localhost',
                    port: 9000,
                    livereload: true
                }
            }
        },

        /**
         * Watch for changes to all Javascript files in the 'src' folder.
         * 'build' is where minified/concatenated files will be placed.
         */
        watch: {
            scripts: {
                files: [
                    // '<%= appConfig.jsSource %>/{,*/}*.js'
                    '<%= appConfig.jsSource %>/**/*.js'
                ],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            },
            // trigger livereload when compass is done compiling CSS
            stylesheets: {
                files: [
                    '<%= appConfig.compassDevPath %>/{,*/}*.css'
                ],
                options: {
                    livereload: true
                }
            },
            // trigger livereload when html markup changes
            views: {
                files: [
                    '<%= appConfig.compassHttpPath %>/{,*/}*.html'
                ],
                options: {
                    livereload: true
                }
            }
        },


        concat: {

          /**
          * Concatenate 3rd party Javascript libraries into a single vendor.js file.
          */
          vendorScripts: {
              files: [
                  {
                      dest: '<%= appConfig.jsDevPath %>/vendor.js',
                      src: [
                          '<%= appConfig.bowerSource %>/angular/angular.js',
                          '<%= appConfig.bowerSource %>/angular-animate/angular-animate.js',
                          '<%= appConfig.bowerSource %>/angular-touch/angular-touch.js',
                          '<%= appConfig.bowerSource %>/angular-bootstrap/ui-bootstrap-tpls.js',
                          '<%= appConfig.bowerSource %>/angular-ui-router/release/angular-ui-router.js',
                      ]
                  }
              ]
          },

          /**
            * Concatenate custom Javascript into a single scripts.js file.
            */
            customScripts: {
                files: [
                    {
                        dest: '<%= appConfig.jsDevPath %>/donortega.js',
                        src: [
                            '<%= appConfig.jsSource %>/{,*/}*'
                        ]
                    }
                ]
            }
        },

        uglify: {

            /**
            * Minify concatenated vendor.js into vendor.min.js.
            */
            vendorScripts: {
                files: [
                    {dest: '<%= appConfig.jsBuildPath %>/vendor.min.js', src: ['<%= appConfig.jsDevPath %>/vendor.js']}
                ]
            },

            /**
            * Minify custom js scripts.
            * @type {Object}
            */
            customScripts: {
                files: [
                    {dest: '<%= appConfig.jsBuildPath %>/donortega.min.js', src: ['<%= appConfig.jsDevPath %>/donortega.js']}
                ]
            }
        },


        /**
        * Runs files through jshint to look for syntax errors. Uses the config in /.jshintrc
        */
        jshint: {
            options: {
                jshintrc: '.jshintrc'
                // ignores: [
                //   '<%= appConfig.jsDevPath %>/*.js',
                //   '<%= appConfig.jsBuildPath %>/*.js'
                // ]
            },
            all: [
                'Gruntfile.js',
                '<%= appConfig.jsSource %>/js/{,*/}*.js'
            ]
        },

        /**
        * Copy Bootstrap icon fonts to project assets folder
        */
        copy: {
            fontawesome: {
                cwd: '<%= appConfig.bowerSource %>/components-font-awesome/fonts',
                src: '**/*',
                dest: '<%= appConfig.compassFontsPath %>/font-awesome',
                expand: true
            }
        },

        /**
        * Compass
        */
        compass: {
            dev: {
                options: {
                    bundleExec: true,
                    watch: true,
                    sassDir: '<%= appConfig.compassSource %>',
                    cssDir: '<%= appConfig.compassDevPath %>',
                    importPath: '<%= appConfig.compassImportPath %>',
                    imagesPath: '<%= appConfig.compassImagesPath %>',
                    imagesDir: '<%= appConfig.compassImagesDir %>',
                    fontsPath: '<%= appConfig.compassFontsPath %>',
                    fontsDir: '<%= appConfig.compassFontsDir %>',
                    outputStyle: 'expanded',
                    noLineComments: false
                }
            },
            build: {
                options: {
                    bundleExec: true,
                    watch: true,
                    sassDir: '<%= appConfig.compassSource %>',
                    cssDir: '<%= appConfig.compassBuildPath %>',
                    importPath: '<%= appConfig.compassImportPath %>',
                    imagesPath: '<%= appConfig.compassImagesPath %>',
                    imagesDir: '<%= appConfig.compassImagesDir %>',
                    fontsPath: '<%= appConfig.compassFontsPath %>',
                    fontsDir: '<%= appConfig.compassFontsDir %>',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            }
        },


        concurrent: {
            startDev: {
                tasks: ['watch', 'compass:dev', 'server'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });


    /**
    * Start a local server instance.
    *
    * Command: grunt server
    */
    grunt.registerTask('server', [
        'express:dev',
        'express-keepalive'
    ]);


    /**
    * Type 'grunt dev' to start local web server AND watcher that watches JS and CSS files.
    */
    grunt.registerTask('dev', [
        'copy:fontawesome',
        'concurrent:startDev'
    ]);

    /**
    * If you simply type 'grunt' in your command line, it will run the 'grunt server' command.
    */
    grunt.registerTask('default', ['dev']);

    /**
    * Build all custom scripts.
    * Note: If you're already running 'grunt watcher' you don't need to run this command.
    *
    * Command: grunt build
    */
    grunt.registerTask('build', [
        'jshint',
        'concat:customScripts',
        'uglify:customScripts'
    ]);

    /**
    * Concatenate and minify all 3rd party scripts into separate file.
    * Not included in the watcher. Must be run explicitly if you want to add additional vendor libraries.
    *
    * Command: grunt buildVendorScripts
    */
    grunt.registerTask('buildVendorScripts', [
        'concat:vendorScripts',
        'uglify:vendorScripts'
    ]);

};
