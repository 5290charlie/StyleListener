module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Project configuration.
    grunt.initConfig({
        uglify: {
            my_target: {
                files: {
                    'build/style-listener.min.js': [
                        'src/style-listener.js'
                    ]
                }
            }
        },
        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['build']
            }
        },
    });

    grunt.registerTask('build', ['uglify']);
    grunt.registerTask('default', ['build']);
};
